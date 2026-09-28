import json
import urllib.request
import urllib.parse
import time
import base64
import hmac
import hashlib

# Load service account
with open("backend/src/main/resources/firebase-service-account.json", "r") as f:
    sa = json.load(f)

# Helper to generate JWT for Google Auth
def get_jwt():
    header = {"alg": "RS256", "typ": "JWT"}
    now = int(time.time())
    payload = {
        "iss": sa["client_email"],
        "scope": "https://www.googleapis.com/auth/datastore",
        "aud": sa["token_uri"],
        "exp": now + 3600,
        "iat": now
    }
    
    def b64url(d):
        return base64.urlsafe_b64encode(json.dumps(d).encode()).decode().rstrip("=")

    jwt_head_payload = f"{b64url(header)}.{b64url(payload)}"

    # Sign using RSA private key via openssl or cryptography if available, else python
    import ssl
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding

    private_key = serialization.load_pem_private_key(
        sa["private_key"].encode(),
        password=None
    )
    signature = private_key.sign(
        jwt_head_payload.encode(),
        padding.PKCS1v15(),
        hashes.SHA256()
    )
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    return f"{jwt_head_payload}.{sig_b64}"

def get_access_token():
    jwt_token = get_jwt()
    data = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt_token
    }).encode('utf-8')
    req = urllib.request.Request(sa["token_uri"], data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        return res["access_token"]

def clear_all_applicants():
    print("Obtaining access token...")
    token = get_access_token()
    headers = {"Authorization": f"Bearer {token}"}

    url = f"https://firestore.googleapis.com/v1/projects/{sa['project_id']}/databases/(default)/documents/applicants"
    print(f"Fetching applicants from {url}...")
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            documents = data.get("documents", [])
            print(f"Found {len(documents)} applicant documents to delete.")
            for doc in documents:
                doc_name = doc["name"]
                del_url = f"https://firestore.googleapis.com/v1/{doc_name}"
                del_req = urllib.request.Request(del_url, headers=headers, method="DELETE")
                with urllib.request.urlopen(del_req) as del_resp:
                    print(f"Deleted applicant: {doc_name.split('/')[-1]}")
            print("Successfully removed all current applicants!")
    except Exception as e:
        print("Error clearing applicants:", e)

if __name__ == "__main__":
    clear_all_applicants()
