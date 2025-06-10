from datetime import datetime
import requests
from openai import OpenAI

class CheckInAssistant:
    _cached_key = None
    def __init__(self):
        self.system_prompt = self._build_system_prompt()
        self.api_key = self._get_api_key()
        self.client = OpenAI(api_key=self.api_key)

    def _build_system_prompt(self):
        return f"""
        Today is {datetime.now().strftime('%m/%d/%Y')}.
        GENERAL RULES:
        - Be warm, friendly, and professional.
        - Keep responses short and polite.
        - Avoid markdown or numbered lists.
        - Ask only one question at a time unless clarity requires more.
        - Do not confirm the check in until all required data is collected.
        - When all required info is gathered, respond with:

        Check in Complete
        {{
            "visitor_name": "...",
            "visitor_phone": "...",
            "employee_name": "...",
            "employee_email": "...",
            "default_employee": "...",
        }}

        OBJECTIVE:
        Help visitors check in by collecting the following:
        - Visitor's name.
        - Visitor's phone number.
        - The employee they are here to meet.
        - The employee's email address.

        FLOW LOGIC:
        1. Ask for the visitor's name.
        2. Ask for the visitor's phone number.
        4. Ask whom they're here to see and tell them they can respond with I don't know and we can direct them as well. If they respond with "I don't know" or "Not sure", set the default_employee to true. If they were able to provide an employee name and address, set it to false.
        5. Ask for the employee's email address (unless already provided via the "I don't know" flow).

        6. Once all of the above is collected, complete the check in by saying **exactly**:

            ' check in complete '

        Then, on a new line, print the structured JSON object.
        """.strip()


    def _get_api_key(self):
        if CheckInAssistant._cached_key:
            return CheckInAssistant._cached_key

        url = 'https://kk2j6nl1s0.execute-api.us-west-2.amazonaws.com/prd/vmpro/key'
        response = requests.get(url)
        if response.status_code == 200:
            key_suffix = response.json()
            full_key = f"sk-proj-x9FX632me7W7mXgiBKBdELXd-_TZEYLgU6CuDiDNHt_{key_suffix}"
            CheckInAssistant._cached_key = full_key
            return full_key
        else:
            raise RuntimeError("Failed to retrieve API key")

    def get_openai_client(self):
        return self.client

    def get_prompt(self):
        return self.system_prompt
