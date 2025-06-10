import queue
import threading
from datetime import datetime,  timedelta
import time

# SimpleMemoryCache class with TTL support
class SimpleMemoryCache:
    def __init__(self, app, max_size=10000):
        self.app = app
        self.cache = {}
        self.expiry = {}
        self.write_queue = queue.Queue()
        self.lock = threading.RLock()
        self.max_size = max_size
        self.start_background_writer()
        self.start_cache_cleaner()

    def get(self, key):
        """Get value from cache if not expired"""
        with self.lock:
            if key in self.cache:
                if key in self.expiry and datetime.now() > self.expiry[key]:
                    # Expired
                    del self.cache[key]
                    del self.expiry[key]
                    return None
                return self.cache[key]
        return None

    def set(self, key, value, ttl_seconds=3600):
        """Set value in cache with TTL (Time To Live)"""
        with self.lock:
            # If cache is full, remove oldest entries
            if len(self.cache) >= self.max_size and key not in self.cache:
                self._evict_oldest()

            self.cache[key] = value
            if ttl_seconds > 0:
                self.expiry[key] = datetime.now() + timedelta(seconds=ttl_seconds)
            elif key in self.expiry:
                # Remove expiry if ttl_seconds is 0 (permanent cache)
                del self.expiry[key]

    def delete(self, key):
        """Delete key from cache"""
        with self.lock:
            self.cache.pop(key, None)
            self.expiry.pop(key, None)

    def clear_pattern(self, pattern):
        """Clear keys matching pattern (simple string contains)"""
        with self.lock:
            keys_to_delete = [k for k in self.cache.keys() if pattern in k]
            for key in keys_to_delete:
                del self.cache[key]
                self.expiry.pop(key, None)

    def queue_db_write(self, operation_func, *args, **kwargs):
        """Queue database write operation for background processing"""
        self.write_queue.put((operation_func, args, kwargs))

    def _evict_oldest(self):
        """Remove 10% of oldest entries when cache is full"""
        if not self.expiry:
            # If no expiry data, remove arbitrary 10%
            to_remove = max(1, len(self.cache) // 10)
            keys_to_remove = list(self.cache.keys())[:to_remove]
            for key in keys_to_remove:
                del self.cache[key]
            return

        # Sort by expiry time and remove oldest 10%
        sorted_items = sorted(self.expiry.items(), key=lambda x: x[1])
        to_remove = int(len(sorted_items) * 0.1) or 1

        for key, _ in sorted_items[:to_remove]:
            del self.cache[key]
            del self.expiry[key]

    def start_background_writer(self):
        """Start background thread for write-behind operations"""
        def writer_worker():
            while True:
                try:
                    # Get operation from queue (blocks until available)
                    operation_func, args, kwargs = self.write_queue.get(timeout=1)

                    self.app.logger.info(f"[Writer Thread] Executing {operation_func.__name__} with qsize={self.write_queue.qsize()} args={args}, kwargs={kwargs}")
                    
                    # Execute the database operation
                    with self.app.app_context():
                        operation_func(*args, **kwargs)

                    # Mark task as done
                    self.write_queue.task_done()

                except queue.Empty:
                    continue
                except Exception as e:
                    self.app.logger.error(f"Background writer error: {e}")
                    time.sleep(1)

        writer_thread = threading.Thread(target=writer_worker, daemon=True)
        writer_thread.start()

    def start_cache_cleaner(self):
        """Start background thread to clean expired entries"""
        def cleaner_worker():
            while True:
                try:
                    time.sleep(60)  # Clean every 1 minute
                    now = datetime.now()
                    with self.lock:
                        expired_keys = [
                            key for key, exp_time in self.expiry.items()
                            if now > exp_time
                        ]
                        for key in expired_keys:
                            del self.cache[key]
                            del self.expiry[key]

                        if expired_keys:
                            self.app.logger.info(f"Cache cleaned {len(expired_keys)} expired entries")

                    # Optional: Trigger garbage collection periodically
                    import gc
                    if len(self.cache) > 1000:  # Only if cache is large
                        gc.collect()

                except Exception as e:
                    print(f"Cache cleaner error: {e}")

        cleaner_thread = threading.Thread(target=cleaner_worker, daemon=True)
        cleaner_thread.start()

    def stats(self):
        """Get cache statistics"""
        with self.lock:
            now = datetime.now()
            expired_count = sum(1 for exp_time in self.expiry.values() if now > exp_time)
            return {
                'total_keys': len(self.cache),
                'expired_keys': expired_count,
                'active_keys': len(self.cache) - expired_count,
                'queue_size': self.write_queue.qsize(),
                'memory_usage_mb': sum(len(str(v)) for v in self.cache.values()) / 1024 / 1024
            }

