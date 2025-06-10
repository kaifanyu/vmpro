# Cached Data Service
class CachedDataService:
    def __init__(self, cache):
        self.cache = cache

    def get_visitor_by_token(self, token):
        """Get visitor with caching"""
        cache_key = f"visitor:token:{token}"

        # Try cache first
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        # Cache miss - query database
        from models import Visitor, Employee, Location
        visitor = Visitor.query.filter_by(qr_token=token).first()

        if visitor:
            # Get related data
            host = Employee.query.get(visitor.host_employee) if visitor.host_employee else None
            location = Location.query.get(visitor.location_id) if visitor.location_id else None

            visitor_data = {
                'id': visitor.id,
                'name': visitor.name,
                'email': visitor.email,
                'phone': visitor.phone,
                'visit_date': visitor.visit_date.isoformat() if visitor.visit_date else None,
                'status': visitor.status,
                'host_employee_id': visitor.host_employee,
                'host_employee_name': host.name if host else None,
                'host_employee_email': host.email if host else None,
                'host_employee_phone': host.phone if host else None,
                'location_id': visitor.location_id,
                'location_name': location.name if location else None,
                'estimate_time': visitor.estimate_time,
                'qr_token': visitor.qr_token,
                'host_notified': visitor.host_notified,
                'photo_url': visitor.photo_url,  # ✅ ADD THIS
                'document_url': visitor.document_url  # ✅ ADD THIS
            }

            # Cache for 15 minutes
            self.cache.set(cache_key, visitor_data, 900)
            return visitor_data

        return None

    def get_employee_by_id(self, emp_id):
        """Get employee with caching"""
        cache_key = f"employee:id:{emp_id}"

        cached = self.cache.get(cache_key)
        if cached:
            return cached

        from models import Employee
        employee = Employee.query.get(emp_id)
        if employee:
            emp_data = {
                'id': employee.id,
                'name': employee.name,
                'email': employee.email,
                'phone': employee.phone,
                'role': employee.role,
                'profile_photo': employee.profile_photo  # Add this line
            }

            # Cache employees for 1 hour
            self.cache.set(cache_key, emp_data, 3600)
            return emp_data

        return None

    def get_all_employees(self):
        """Get all employees with caching"""
        cache_key = "employees:all"

        cached = self.cache.get(cache_key)
        if cached:
            return cached

        from models import Employee
        employees = Employee.query.all()
        emp_list = [
            {
                'id': emp.id,
                'name': emp.name,
                'email': emp.email,
                'phone': emp.phone,
                'role': emp.role,
                'profile_photo': emp.profile_photo
            } for emp in employees
        ]

        # Cache for 30 minutes
        self.cache.set(cache_key, emp_list, 1800)
        return emp_list

    def get_all_locations(self):
        """Get all locations with caching"""
        cache_key = "locations:all"

        cached = self.cache.get(cache_key)
        if cached:
            return cached

        from models import Location
        locations = Location.query.all()
        loc_list = [
            {
                'id': loc.id,
                'name': loc.name,
                'address': loc.address,
                'timezone': loc.timezone
            } for loc in locations
        ]

        # Cache for 2 hours (locations rarely change)
        self.cache.set(cache_key, loc_list, 7200)
        return loc_list

    def update_visitor_status(self, token, status, immediate_db_write=False):
        """Update visitor status with write-behind or immediate DB write"""
        cache_key = f"visitor:token:{token}"

        # Update cache immediately for fast response
        cached_visitor = self.cache.get(cache_key)
        if cached_visitor:
            cached_visitor['status'] = status
            self.cache.set(cache_key, cached_visitor, 900)

        if immediate_db_write:
            # Write to database immediately (for critical operations like cancellation)
            try:
                from models import db,Visitor
                from sqlalchemy import text
                #print(">>> [CacheService __init__] db.session:", db.session)
                db.session.execute(
                    text("UPDATE visitors SET status = :status WHERE qr_token = :token"),
                    {"status": status, "token": token}
                )
                db.session.commit()
                #print(f"Immediate DB update: Visitor {token} status -> {status}")
                return True
            except Exception as e:
                print(f"Immediate DB update error: {e}")
                db.session.rollback()
                return False
        else:
            # Queue database update for background processing (default behavior)
            def update_db():
                try:
                    from models import db,Visitor
                    from sqlalchemy import text
                    db.session.execute(
                        text("UPDATE visitors SET status = :status WHERE qr_token = :token"),
                        {"status": status, "token": token}
                    )
                    db.session.commit()
                    #print(f"Background update: Visitor {token} status -> {status}")
                except Exception as e:
                    print(f"Background update error: {e}")
                    db.session.rollback()

            self.cache.queue_db_write(update_db)
            return True

    def invalidate_visitor_cache(self, token):
        """Invalidate visitor cache"""
        cache_key = f"visitor:token:{token}"
        self.cache.delete(cache_key)

    def invalidate_employee_cache(self, emp_id=None):
        """Invalidate employee cache"""
        if emp_id:
            self.cache.delete(f"employee:id:{emp_id}")
        # Also clear the all employees cache
        self.cache.delete("employees:all")