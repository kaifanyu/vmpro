# email_templates.py - Item Design Theme Email Templates
class ItemEmailTemplates:
    """Email templates following item.com design guidelines"""
    
    @staticmethod
    def get_base_template():
        """Base template with item.com styling"""
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{subject}</title>
            <style>
                * {{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }}
                
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                    line-height: 1.6;
                    color: #000000;
                    background-color: #FFFFFF;
                    margin: 0;
                    padding: 20px;
                }}
                
                .email-container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #FFFFFF;
                    border: 1px solid #E6E6E6;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
                }}
                
                .email-header {{
                    background-color: #FFFFFF;
                    padding: 32px 24px;
                    text-align: center;
                    border-bottom: 1px solid #F2F2F2;
                }}
                
                .logo-container {{
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 64px;
                    height: 64px;
                    background-color: #6B46C1;
                    border-radius: 16px;
                    margin-bottom: 16px;
                }}
                
                .logo-icon {{
                    width: 32px;
                    height: 32px;
                    color: #FFFFFF;
                }}
                
                .email-title {{
                    font-size: 24px;
                    font-weight: 700;
                    color: #000000;
                    margin-bottom: 8px;
                }}
                
                .email-subtitle {{
                    font-size: 16px;
                    color: #666666;
                    margin: 0;
                }}
                
                .email-body {{
                    padding: 32px 24px;
                }}
                
                .content-section {{
                    margin-bottom: 32px;
                }}
                
                .content-section:last-child {{
                    margin-bottom: 0;
                }}
                
                .section-title {{
                    font-size: 18px;
                    font-weight: 600;
                    color: #000000;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                }}
                
                .section-icon {{
                    width: 24px;
                    height: 24px;
                    background-color: #6B46C1;
                    border-radius: 6px;
                    margin-right: 12px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }}
                
                .info-grid {{
                    background-color: #F9FAFB;
                    border: 1px solid #E6E6E6;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 24px;
                }}
                
                .info-row {{
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }}
                
                .info-row:last-child {{
                    margin-bottom: 0;
                }}
                
                .info-label {{
                    font-weight: 500;
                    color: #666666;
                    flex-shrink: 0;
                    width: 40%;
                }}
                
                .info-value {{
                    font-weight: 600;
                    color: #000000;
                    text-align: right;
                    flex-grow: 1;
                }}
                
                .cta-button {{
                    display: inline-block;
                    background-color: #6B46C1;
                    color: #FFFFFF;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    text-align: center;
                    margin: 16px 0;
                    transition: background-color 0.2s ease;
                }}
                
                .cta-button:hover {{
                    background-color: #5B3BA5;
                }}
                
                .secondary-button {{
                    display: inline-block;
                    background-color: #FFFFFF;
                    color: #6B46C1;
                    border: 1px solid #6B46C1;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    text-align: center;
                    margin: 16px 0;
                    transition: all 0.2s ease;
                }}
                
                .secondary-button:hover {{
                    background-color: #F3F4F6;
                }}
                
                .alert-box {{
                    background-color: #FFF7ED;
                    border: 1px solid #F97316;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 16px 0;
                }}
                
                .alert-box.success {{
                    background-color: #F0FDF4;
                    border-color: #6B46C1;
                }}
                
                .alert-text {{
                    color: #F97316;
                    font-weight: 500;
                    margin: 0;
                }}
                
                .alert-text.success {{
                    color: #6B46C1;
                }}
                
                .email-footer {{
                    background-color: #F9FAFB;
                    padding: 24px;
                    text-align: center;
                    border-top: 1px solid #E6E6E6;
                }}
                
                .footer-text {{
                    font-size: 14px;
                    color: #666666;
                    margin: 0 0 8px 0;
                }}
                
                .footer-link {{
                    color: #6B46C1;
                    text-decoration: none;
                }}
                
                .footer-link:hover {{
                    text-decoration: underline;
                }}
                
                /* Mobile responsiveness */
                @media (max-width: 600px) {{
                    body {{
                        padding: 10px;
                    }}
                    
                    .email-header, .email-body, .email-footer {{
                        padding: 20px 16px;
                    }}
                    
                    .info-row {{
                        flex-direction: column;
                        gap: 4px;
                    }}
                    
                    .info-label, .info-value {{
                        width: 100%;
                        text-align: left;
                    }}
                    
                    .cta-button, .secondary-button {{
                        display: block;
                        width: 100%;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <header class="email-header">
                    <div class="logo-container">
                        <div class="logo-icon">✦</div>
                    </div>
                    <h1 class="email-title">{title}</h1>
                    <p class="email-subtitle">{subtitle}</p>
                </header>
                
                <main class="email-body">
                    {content}
                </main>
                
                <footer class="email-footer">
                    <p class="footer-text">This is an automated message from the Visitor Management System</p>
                    <p class="footer-text">
                        <a href="{base_url}" class="footer-link">Visit our portal</a> • 
                        <a href="mailto:support@company.com" class="footer-link">Get support</a>
                    </p>
                </footer>
            </div>
        </body>
        </html>
        """
    
    @staticmethod
    def visitor_arrival_alert(visitor_name, host_name, visit_date, estimate_time, location_name, link):
        """Email template for visitor arrival notification"""
        content = f"""
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">👋</span>
                Visitor Has Arrived
            </h2>
            <p style="color: #666666; margin-bottom: 24px;">
                Your visitor has checked in and is waiting to meet with you.
            </p>
        </div>
        
        <div class="content-section">
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Visitor Name:</span>
                    <span class="info-value">{visitor_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Host:</span>
                    <span class="info-value">{host_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-in Time:</span>
                    <span class="info-value">{visit_date}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Estimated Duration:</span>
                    <span class="info-value">{estimate_time}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">{location_name}</span>
                </div>
            </div>
        </div>
        
        <div class="content-section">
            <div class="alert-box success">
                <p class="alert-text success">
                    Please greet your visitor at the reception area.
                </p>
            </div>
            
            <a href="{link}" class="cta-button">Manage Visit</a>
            
            <p style="color: #666666; font-size: 14px; margin-top: 16px;">
                Remember to check out your guest when the meeting is finished.
            </p>
        </div>
        """
        
        return ItemEmailTemplates.get_base_template().format(
            subject="Visitor Arrival Alert",
            title="Visitor Arrival",
            subtitle="Your guest has arrived",
            content=content,
            base_url="{base_url}"
        )
    
    @staticmethod
    def visitor_registration_confirmation(visitor_name, host_name, visit_date, estimate_time, link):
        """Email template for visitor registration confirmation"""
        content = f"""
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">✓</span>
                Registration Confirmed
            </h2>
            <p style="color: #666666; margin-bottom: 24px;">
                Your visit has been successfully registered. Please keep this information for your records.
            </p>
        </div>
        
        <div class="content-section">
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Visitor Name:</span>
                    <span class="info-value">{visitor_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Meeting With:</span>
                    <span class="info-value">{host_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Scheduled Time:</span>
                    <span class="info-value">{visit_date}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Expected Duration:</span>
                    <span class="info-value">{estimate_time}</span>
                </div>
            </div>
        </div>
        
        <div class="content-section">
            <div class="alert-box">
                <p class="alert-text">
                    Please arrive on time and bring a valid ID for check-in.
                </p>
            </div>
            
            <a href="{link}" class="cta-button">View Visit Details</a>
            <a href="{link}" class="secondary-button">Cancel/Reschedule</a>
        </div>
        """
        
        return ItemEmailTemplates.get_base_template().format(
            subject="Visit Registration Confirmation",
            title="Visit Confirmed",
            subtitle="Your registration is complete",
            content=content,
            base_url="{base_url}"
        )
    
    @staticmethod
    def upcoming_visitor_alert(visitor_name, host_name, visit_date, estimate_time, link):
        """Email template for upcoming visitor notification"""
        content = f"""
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">⏰</span>
                Upcoming Visit
            </h2>
            <p style="color: #666666; margin-bottom: 24px;">
                You have a visitor scheduled to arrive soon. Please prepare for their visit.
            </p>
        </div>
        
        <div class="content-section">
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Visitor Name:</span>
                    <span class="info-value">{visitor_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Host:</span>
                    <span class="info-value">{host_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Scheduled Time:</span>
                    <span class="info-value">{visit_date}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Expected Duration:</span>
                    <span class="info-value">{estimate_time}</span>
                </div>
            </div>
        </div>
        
        <div class="content-section">
            <div class="alert-box">
                <p class="alert-text">
                    Your visitor should arrive within the next 15 minutes.
                </p>
            </div>
            
            <a href="{link}" class="cta-button">View Details</a>
        </div>
        """
        
        return ItemEmailTemplates.get_base_template().format(
            subject="Upcoming Visitor Alert",
            title="Visitor Arriving Soon",
            subtitle="Scheduled meeting reminder",
            content=content,
            base_url="{base_url}"
        )
    
    @staticmethod
    def visitor_checkout_notification(visitor_name, host_name, checkin_time, checkout_time, duration, estimated_duration):
        """Email template for visitor checkout notification"""
        content = f"""
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">✅</span>
                Visit Completed
            </h2>
            <p style="color: #666666; margin-bottom: 24px;">
                Your visitor has successfully checked out. Here's a summary of their visit.
            </p>
        </div>
        
        <div class="content-section">
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Visitor Name:</span>
                    <span class="info-value">{visitor_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Host:</span>
                    <span class="info-value">{host_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-in Time:</span>
                    <span class="info-value">{checkin_time}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-out Time:</span>
                    <span class="info-value">{checkout_time}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Actual Duration:</span>
                    <span class="info-value">{duration}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Estimated Duration:</span>
                    <span class="info-value">{estimated_duration}</span>
                </div>
            </div>
        </div>
        
        <div class="content-section">
            <div class="alert-box success">
                <p class="alert-text success">
                    Thank you for ensuring a smooth check-out process.
                </p>
            </div>
        </div>
        """
        
        return ItemEmailTemplates.get_base_template().format(
            subject="Visitor Checked Out",
            title="Visit Complete",
            subtitle="Your visitor has departed",
            content=content,
            base_url="{base_url}"
        )
    
    @staticmethod
    def visitor_checkout_reminder(visitor_name, host_name, checkin_time, estimated_duration, actual_duration, link):
        """Email template for visitor checkout reminder"""
        content = f"""
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">⏰</span>
                Checkout Reminder
            </h2>
            <p style="color: #666666; margin-bottom: 24px;">
                Your visitor's estimated time has elapsed. Please ensure they have checked out.
            </p>
        </div>
        
        <div class="content-section">
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Visitor Name:</span>
                    <span class="info-value">{visitor_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Host:</span>
                    <span class="info-value">{host_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-in Time:</span>
                    <span class="info-value">{checkin_time}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Estimated Duration:</span>
                    <span class="info-value">{estimated_duration}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Current Duration:</span>
                    <span class="info-value">{actual_duration}</span>
                </div>
            </div>
        </div>
        
        <div class="content-section">
            <div class="alert-box">
                <p class="alert-text">
                    Please check if your visitor is ready to depart and help them check out.
                </p>
            </div>
            
            <a href="{link}" class="cta-button">Check Out Visitor</a>
        </div>
        """
        
        return ItemEmailTemplates.get_base_template().format(
            subject="Visitor Checkout Reminder",
            title="Checkout Required",
            subtitle="Time to check out your visitor",
            content=content,
            base_url="{base_url}"
        )


# Integration helper function to replace existing email generation
def generate_email_html(email_type, **kwargs):
    """
    Generate HTML email using Item design templates
    
    Args:
        email_type: Type of email ('arrival', 'confirmation', 'upcoming', 'checkout', 'checkout_reminder')
        **kwargs: Email-specific parameters
    
    Returns:
        HTML string formatted with item.com design
    """
    
    # Replace {base_url} with actual base URL from kwargs
    base_url = kwargs.get('base_url', 'http://localhost:8080')
    
    if email_type == 'arrival':
        html = ItemEmailTemplates.visitor_arrival_alert(
            visitor_name=kwargs['visitor_name'],
            host_name=kwargs['host_name'],
            visit_date=kwargs['visit_date'],
            estimate_time=kwargs['estimate_time'],
            location_name=kwargs['location_name'],
            link=kwargs['link']
        )
    elif email_type == 'confirmation':
        html = ItemEmailTemplates.visitor_registration_confirmation(
            visitor_name=kwargs['visitor_name'],
            host_name=kwargs['host_name'],
            visit_date=kwargs['visit_date'],
            estimate_time=kwargs['estimate_time'],
            link=kwargs['link']
        )
    elif email_type == 'upcoming':
        html = ItemEmailTemplates.upcoming_visitor_alert(
            visitor_name=kwargs['visitor_name'],
            host_name=kwargs['host_name'],
            visit_date=kwargs['visit_date'],
            estimate_time=kwargs['estimate_time'],
            link=kwargs['link']
        )
    elif email_type == 'checkout':
        html = ItemEmailTemplates.visitor_checkout_notification(
            visitor_name=kwargs['visitor_name'],
            host_name=kwargs['host_name'],
            checkin_time=kwargs['checkin_time'],
            checkout_time=kwargs['checkout_time'],
            duration=kwargs['duration'],
            estimated_duration=kwargs['estimated_duration']
        )
    elif email_type == 'checkout_reminder':
        html = ItemEmailTemplates.visitor_checkout_reminder(
            visitor_name=kwargs['visitor_name'],
            host_name=kwargs['host_name'],
            checkin_time=kwargs['checkin_time'],
            estimated_duration=kwargs['estimated_duration'],
            actual_duration=kwargs['actual_duration'],
            link=kwargs['link']
        )
    else:
        raise ValueError(f"Unknown email type: {email_type}")
    
    # Replace base_url placeholder
    return html.replace("{base_url}", base_url)
