import urllib.request
import json

url = "https://talentplus.onrender.com/api/webhooks/google-form"
headers = {
    "Content-Type": "application/json",
    "X-Webhook-Secret": "talentpulse-secret-key"
}
payload = {
    "email": "test_render_live@example.com",
    "firstName": "Production",
    "lastName": "Tester",
    "rawFormResponses": {
        "Timestamp": "2026-09-28 03:30",
        "Email Address": "test_render_live@example.com",
        "Full Name": "Production Tester",
        "Phone Number": "9999999999"
    }
}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method="POST")
try:
    with urllib.request.urlopen(req) as resp:
        print("HTTP Status:", resp.status)
        print("Response:", resp.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
