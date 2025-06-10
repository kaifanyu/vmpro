import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class SendMail():
    def send(self, recipients, subject, body):
        smtp_server = "syssmtp.unisco.com"
        port = '587'
        sender_email = "jj.lin@unisco.com"
        receiver_email = "mareinke@hotmail.com"
        password = 'ypdcptemiqzakmzy'

        msg = MIMEMultipart()
        msg['Subject'] = subject
        msg['From'] = "marco.ma@unisco.com"
        msg['To'] = recipients
        msg.attach(MIMEText(body, 'html'))
        try:
            smtp = smtplib.SMTP(smtp_server, port=port)
            smtp.ehlo()
            smtp.starttls()
            smtp.login('marco.ma@unisco.com', password)
            smtp.send_message(msg)
            # TODO: Send email here
        except Exception as e:
            # Print any error messages to stdout
            print(e)
        finally:
            smtp.quit()