from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Employee(db.Model):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='staff')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    profile_photo = db.Column(db.String(255))


class Visitor(db.Model):
    __tablename__ = 'visitors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(150))
    visit_date = db.Column(db.DateTime, nullable=False)
    host_employee = db.Column(db.Integer, nullable=False)  # Reference to Employee.id (no FK)
    qr_token = db.Column(db.String(100), unique=True, nullable=False)
    status = db.Column(db.String(50), default='pending')
    photo_url = db.Column(db.String(255))
    document_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    location_id = db.Column(db.Integer, nullable=True)
    host_notified = db.Column(db.Boolean, default=False)
    visitor_notified = db.Column(db.Boolean, default=False)
    checkin_completed = db.Column(db.Boolean, default=False)
    checkout_notified = db.Column(db.Boolean, default=False)
    estimate_time = db.Column(db.String(20), default='02:00:00')

    '''
    def update_status(self):
        if self.checkin_completed:
            self.status = 'checked-in'
        elif self.host_notified and self.visitor_notified:
            self.status = 'notified'
        else:
            self.status = 'pending'
    '''


class VisitLog(db.Model):
    __tablename__ = 'visit_logs'

    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.Integer, nullable=False)
    event_type = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())


class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    recipient_type = db.Column(db.String(20), nullable=False)  # 'visitor' or 'employee'
    recipient_id = db.Column(db.Integer, nullable=False)
    method = db.Column(db.String(20), nullable=False)  # 'email', 'sms'
    status = db.Column(db.String(20), default='sent')
    message = db.Column(db.Text)
    sent_at = db.Column(db.DateTime, server_default=db.func.now())

    @staticmethod
    def log(recipient_type, recipient_id, method, status, message):
        try:
            notification = Notification(
                recipient_type=recipient_type,
                recipient_id=recipient_id,
                method=method,
                status=status,
                message=message
            )
            db.session.add(notification)
            db.session.commit()
        except Exception as e:
            print("Notification log error:", str(e))
            db.session.rollback()
            raise


class Location(db.Model):
    __tablename__ = 'locations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255))
    timezone = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    default_employee = db.Column()

    default_employee = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=True)
    default_employee_obj = db.relationship('Employee', backref='default_locations', foreign_keys=[default_employee])