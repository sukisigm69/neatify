import json
import urllib.request
import urllib.error
import time
import subprocess
import sys
import os
import socket

BASE = "http://localhost:5000/api"
TS = f"py{int(time.time())}"
results = []

def check(name, expected, resp):
    ok = expected in resp
    results.append((name, ok))
    status = "OK" if ok else "FAIL"
    print(f"  [{status}] {name}")
    if not ok:
        print(f"    got: {resp[:200]}")
    return ok

def api(method, endpoint, data=None, token=None, timeout=10):
    url = f"{BASE}{endpoint}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    
    body = None
    if data:
        body = json.dumps(data).encode("utf-8")
        
    try:
        with urllib.request.urlopen(req, data=body, timeout=timeout) as res:
            return res.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.read().decode("utf-8")
    except Exception as e:
        return json.dumps({"success": False, "message": str(e)})

def wait_for_server(host="localhost", port=5000, max_wait=30):
    """Poll until server is accepting connections."""
    start = time.time()
    while time.time() - start < max_wait:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)
            s.connect((host, port))
            s.close()
            return True
        except:
            time.sleep(1)
    return False

# Start server
print("Starting server...")

# Kill anything on port 5000 first
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = s.connect_ex(('localhost', 5000))
    s.close()
    if result == 0:
        os.system('cmd.exe /c "for /f \\"tokens=5\\" %a in (\'netstat -ano ^| findstr :5000 ^| findstr LISTENING\') do taskkill /F /PID %a" >nul 2>&1')
        time.sleep(2)
except:
    pass

env = os.environ.copy()
proc = subprocess.Popen(["npx", "tsx", "-r", "dotenv/config", "src/server.ts"], env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)

if not wait_for_server():
    print("ERROR: Server did not start in time")
    proc.terminate()
    proc.wait()
    sys.exit(1)

# Extra grace period after port opens
time.sleep(2)

try:
    print("=== AUTH ===")
    r = api("POST", "/auth/register", {"name":"Org User","email":f"org-{TS}@test.id","password":"password123"})
    check("Register User (Organizer)", '"success":true', r)
    token = json.loads(r).get("data", {}).get("token")

    r = api("POST", "/auth/register-organizer", {"orgName":f"TestOrg{TS}"}, token=token)
    check("Register Organizer", '"success":true', r)

    r = api("POST", "/auth/login", {"email":f"org-{TS}@test.id","password":"password123"})
    check("Re-login ORGANIZER", '"ORGANIZER"', r)
    token = json.loads(r).get("data", {}).get("token")

    # Regular user for buying
    r = api("POST", "/auth/register", {"name":"Regular Buyer","email":f"buyer-{TS}@test.id","password":"password123"})
    check("Register Regular Buyer", '"success":true', r)
    buyer_token = json.loads(r).get("data", {}).get("token")

    # Admin token for venue/event approval
    r = api("POST", "/auth/login", {"email":"superadmin@konsera.id","password":"SuperAdmin123!"})
    admin_token = json.loads(r).get("data", {}).get("token")

    print("\n=== VENUE ===")
    r = api("POST", "/venues", {"name":"GBK Stadium","address":"Jl. Pintu Satu Senayan","city":"Jakarta","province":"DKI Jakarta","capacity":77000}, token=admin_token)
    check("Create venue", '"success":true', r)
    venue_id = json.loads(r).get("data", {}).get("id")

    print("\n=== ARTIST ===")
    r = api("POST", "/artists", {"name":"Tulus","genre":"Pop","bio":"Indonesian singer"}, token=token)
    check("Create artist", '"success":true', r)
    artist_id = json.loads(r).get("data", {}).get("id")

    print("\n=== EVENT ===")
    r = api("POST", "/events", {
        "venueId": venue_id,
        "title": f"Tulus Concert {TS}",
        "description": "An amazing concert by Tulus at GBK Stadium",
        "startDate": "2026-08-15T19:00:00Z",
        "endDate": "2026-08-15T22:00:00Z",
        "artistIds": [artist_id]
    }, token=token)
    check("Create event", '"success":true', r)
    event_id = json.loads(r).get("data", {}).get("id")

    # Submit event for approval
    r = api("PATCH", f"/events/{event_id}/submit", token=token)
    check("Submit event", '"PENDING_APPROVAL"', r)

    # Admin approve
    r = api("PATCH", f"/events/{event_id}/status", {"status":"PUBLISHED"}, token=admin_token)
    check("Admin publish event", '"PUBLISHED"', r)

    print("\n=== TICKET CATEGORY ===")
    r = api("POST", f"/ticket-categories/event/{event_id}", {"name":"VIP","price":500000,"quota":100}, token=token)
    check("Create VIP category", '"success":true', r)
    cat_id = json.loads(r).get("data", {}).get("id")

    print("\n=== CHECKOUT & ORDER ===")
    r = api("POST", "/orders/checkout", {
        "eventId": event_id,
        "items": [
            {"ticketCategoryId": cat_id, "quantity": 2}
        ]
    }, token=buyer_token)
    check("Checkout 2 tickets", '"success":true', r)
    d = json.loads(r) if r.startswith("{") else {}
    order_id = d.get("data", {}).get("id")
    order_invoice = d.get("data", {}).get("invoice_number")

    print("\n=== PAYMENT ===")
    r = api("POST", "/payments/snap", {"orderId": order_id}, token=buyer_token)
    check("Get Midtrans snap token", '"snapToken"', r)
    
    # Mock midtrans payment webhook settlement (longer timeout — QR generation is slow)
    r = api("POST", "/payments/webhook", {
        "order_id": order_invoice,
        "transaction_status": "settlement",
        "fraud_status": "accept",
        "payment_type": "qris",
        "transaction_id": f"midtrans-tx-{TS}",
        "gross_amount": "1000000",
        "status_code": "200"
    }, timeout=30)
    check("Midtrans webhook settlement", '"success":true', r)

    # Get order status after payment
    r = api("GET", f"/orders/{order_id}", token=buyer_token)
    check("Order status confirmed", '"CONFIRMED"', r)

    print("\n=== TICKETS ===")
    # List buyer's tickets
    r = api("GET", "/tickets", token=buyer_token)
    check("List buyer tickets", '"VIP"', r)
    tickets = json.loads(r).get("data", {}).get("tickets", [])
    ticket_id = tickets[0].get("ticketId") if tickets else None
    
    # Scan ticket (successful check-in by organizer)
    r = api("POST", "/tickets/scan", {"qrCode": ticket_id, "location": "Main Entrance"}, token=token)
    check("Scan ticket", '"Ticket scanned successfully"', r)

    # Scan ticket again (should fail because USED)
    r = api("POST", "/tickets/scan", {"qrCode": ticket_id, "location": "Main Entrance"}, token=token)
    check("Scan already used ticket (fail check)", 'already been used', r)

finally:
    proc.terminate()
    proc.wait()

passed = sum(1 for _,ok in results if ok)
failed = sum(1 for _,ok in results if not ok)
print(f"\nResults: {passed} passed, {failed} failed")

if failed > 0:
    sys.exit(1)
sys.exit(0)
