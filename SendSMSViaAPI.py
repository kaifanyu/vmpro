import requests
import json


class SendSMSViaAPI:
    def __init__(self, api_url):
        self.api_url = api_url

    def send(self, to_number, message_body):
        payload = {
            "to": to_number,
            "body": message_body
        }
        try:
            response = requests.post(
                self.api_url,
                headers={"Content-Type": "application/json"},
                data=json.dumps(payload)
            )
            if response.status_code == 200:
                print("SMS sent successfully:", response.json())
                return True
            else:
                print("Failed to send SMS:", response.status_code, response.text)
                return False
        except Exception as e:
            print("Error sending SMS via API:", str(e))
            return False
