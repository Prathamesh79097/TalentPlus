import urllib.request
import json

url = "https://talentplus.onrender.com/api/applicants/all"
req = urllib.request.Request(url, method="DELETE")
try:
    with urllib.request.urlopen(req) as resp:
        print("Status:", resp.status)
        print("Response:", resp.read().decode('utf-8'))
except Exception as e:
    print("Error calling delete all applicants:", e)
