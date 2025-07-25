# Visitor Management System

A full-featured visitor management platform built with **Flask** and **MySQL**, designed for front desk check-ins, QR-based access, automated email/SMS alerts, and employee/location management. It includes a responsive UI, REST API, caching layer, and background notification processing.

![Python](https://img.shields.io/badge/python-v3.10+-blue.svg)
![Flask](https://img.shields.io/badge/flask-latest-green.svg)
![MySQL](https://img.shields.io/badge/mysql-latest-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

- **Visitor Registration**: Register visitors with name, phone, email, visit date, estimated stay, and photo/document upload
- **QR Code Access**: Generate and email QR codes for contactless check-in/out
- **Automated Notifications**: Automatic host alerts via email and SMS
- **AI Assistant**: Real-time check-in assistant powered by OpenAI GPT-4 Turbo
- **Admin Panel**: Manage employees, visitors, and logs using Flask-Admin
- **Performance Optimization**: Memory cache with TTL and asynchronous database writes
- **REST API**: RESTful API endpoints for frontend/backend integration
- **Background Monitoring**: Daily background monitor thread for sending scheduled visit alerts

## 🛠️ Tech Stack

- **Backend**: Python 3.10, Flask, SQLAlchemy
- **Database**: MySQL (via PyMySQL)
- **Admin Interface**: Flask-Admin
- **Image Processing**: ZBar, QRCode, PIL for image and QR processing
- **Notifications**: Twilio or AWS Lambda API for SMS/Email
- **AI Integration**: OpenAI API for AI chat assistant
- **Caching**: SimpleMemoryCache for performance optimization

## 🚀 Quick Start

### Prerequisites

- Linux (tested on Ubuntu)
- Python 3.10+
- MySQL server

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/visitor-management-system.git
   cd visitor-management-system
   ```

2. **Install system dependencies:**
   ```bash
   sudo apt update
   sudo apt install libzbar-dev
   ```

3. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Configuration

1. **Database Configuration:**
   Edit `app.config` in your application:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@host/dbname'
   ```

2. **Environment Variables:**
   Create a `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   SECRET_KEY=your_secret_key
   ```

### Running the Application

```bash
python app.py
```

The app runs on `http://localhost:8080` by default.

**Access Points:**
- `/login` – Admin login
- `/index` – Main UI  
- `/app/` – React frontend (if integrated)

## 📡 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/visitor/create` | POST | Register a new visitor |
| `/api/visitor/checkin` | POST | Check in via QR code |
| `/api/visitor/checkout` | POST | Check out visitor |
| `/api/employee/list` | GET | List employees |
| `/api/location/list` | GET | List available locations |
| `/chat` | POST | GPT-powered check-in assistant |
| `/api/cache/stats` | GET | Cache diagnostics |

### Example API Usage

**Register a New Visitor:**
```bash
curl -X POST http://localhost:8080/api/visitor/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "phone": "+1234567890",
    "visit_date": "2025-06-06",
    "estimated_stay": "2 hours",
    "host_employee_id": 1
  }'
```

**Check-in via QR Code:**
```bash
curl -X POST http://localhost:8080/api/visitor/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "qr_code": "VIS_12345_ABC123",
    "location_id": 1
  }'
```

## 📁 Project Structure

```
visitor-management-system/
├── app.py                    # Main Flask application
├── models.py                 # SQLAlchemy data models
├── CacheDatabase.py          # CachedDataService wrapper
├── SimpleMemoryCache.py      # TTL in-memory cache with write queue
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── templates/               # Jinja2 HTML templates
│   ├── index.html
│   ├── login.html
│   └── admin/
├── static/                  # Static assets
│   ├── css/
│   ├── js/
│   ├── qr_codes/           # Generated QR codes
│   └── uploads/            # Uploaded files
├── migrations/              # Database migrations
└── tests/                   # Unit tests
    ├── test_api.py
    ├── test_models.py
    └── conftest.py
```

## 🐳 Docker Deployment

**Using Docker Compose:**

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=mysql+pymysql://user:pass@db/visitor_db
    depends_on:
      - db
  
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: visitor_db
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

**Build and run:**
```bash
docker-compose up -d
```

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ --cov=. --cov-report=html

# Run specific test file
python -m pytest tests/test_api.py -v
```

## 🚀 Production Deployment

### Using Gunicorn

```bash
# Install Gunicorn
pip install gunicorn

# Run with multiple workers
gunicorn -w 4 -b 0.0.0.0:8080 app:app
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /static {
        alias /path/to/your/app/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Install pre-commit hooks
pre-commit install

# Run code formatting
black .
flake8 .
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT-4 Turbo API
- [Twilio](https://www.twilio.com/) for SMS services  
- [ZBar](https://github.com/mchehab/zbar) and [qrcode](https://github.com/lincolnloop/python-qrcode) for QR code support
- [Flask](https://flask.palletsprojects.com/) community for the excellent framework

## 📞 Support

- 📧 **Email**: support@yourcompany.com
- 💬 **Issues**: [GitHub Issues](https://github.com/yourusername/visitor-management-system/issues)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/visitor-management-system/wiki)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/yourusername/visitor-management-system/discussions)

## 🔗 Related Projects

- [Flask-Admin](https://github.com/flask-admin/flask-admin) - Simple and extensible administrative interface framework
- [Flask-SQLAlchemy](https://github.com/pallets-projects/flask-sqlalchemy) - Flask extension for SQLAlchemy
- [python-qrcode](https://github.com/lincolnloop/python-qrcode) - Pure python QR Code generator

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Your Team Name]

[🔝 Back to top](#visitor-management-system)

</div>