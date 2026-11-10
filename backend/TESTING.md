# Konsera Backend Testing Guide

## Prerequisites

- Node.js 18+
- MariaDB/MySQL running
- `.env` configured with `DATABASE_URL` and `JWT_SECRET`

## 1. Setup

```bash
cd backend

# Install dependencies and generate Prisma Client
npm ci

# Run this again after changing the Prisma schema or installing with --ignore-scripts
npm run db:generate

# Run migrations
npm run db:migrate

# Seed test data
npm run db:seed
```

After seeding, the following test accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@konsera.id | SuperAdmin123! |
| Admin | admin@konsera.id | Admin123! |
| Organizer | organizer@konsera.id | Organizer123! |
| User | user@konsera.id | User123! |

### Seed Data IDs

| Entity | ID |
|--------|----|
| Venue 1 (GBK) | seed-venue-001 |
| Venue 2 (ICE) | seed-venue-002 |
| Artist 1 (Tulus) | seed-artist-001 |
| Artist 2 (Nadin) | seed-artist-002 |
| Artist 3 (Pamungkas) | seed-artist-003 |
| Event 1 (Published) | seed-event-001 |
| Event 2 (Published) | seed-event-002 |
| Event 3 (Pending) | seed-event-003 |
| TC VIP | seed-tc-001 |
| TC Regular | seed-tc-002 |
| TC Tribune | seed-tc-003 |
| TC Front Row | seed-tc-004 |
| TC General | seed-tc-005 |

## 2. Start the Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`. Health check: `GET /api/health`.

## 3. API Testing with Postman

### Import

1. Open Postman
2. Click **Import** > select `backend/postman/Konsera-API.postman_collection.json`
3. Collection includes 13 folders with 75 requests

### Auto-authentication

The collection automatically saves JWT tokens:
- **Register** and **Login** requests have test scripts that save the token to the `{{token}}` collection variable
- All protected requests reference `{{token}}` as Bearer auth
- No manual token copy-paste needed

### Running Tests

1. **Login first**: Run `Auth > Login` with any seed credential
2. **Run a folder**: Right-click a folder > "Run folder" to execute all requests sequentially
3. **Run everything**: Click the collection > "Run" to execute all 75 requests

### Test Folders

| Folder | Purpose |
|--------|---------|
| Auth | Registration, login, profile |
| Organizer | Organizer CRUD, approval flow |
| Venues | Venue management (admin only) |
| Artists | Artist CRUD |
| Events | Full event lifecycle |
| Ticket Categories | Ticket type management |
| Orders | Checkout, list, cancel |
| Payments | Snap token, webhook |
| Tickets | List, detail, scan |
| Dashboard | Admin statistics |
| Validation Tests | Bad input → 400 responses |
| Authorization Tests | Wrong role → 401/403 responses |
| Edge Cases | Not found, boundary conditions |

### Collection Variables

| Variable | Purpose |
|----------|---------|
| `baseUrl` | API base URL (default: `http://localhost:3000/api`) |
| `token` | Active JWT token (auto-filled on login) |
| `userToken` | User-role JWT for auth tests |
| `organizerToken` | Organizer-role JWT for auth tests |
| `adminToken` | Admin-role JWT for auth tests |

## 4. API Testing with Thunder Client (VS Code)

### Import

1. Install **Thunder Client** extension in VS Code
2. Open Thunder Client sidebar > Collections > Import
3. Select `backend/thunder-client/thunder-collection_Konsera-API.json`
4. Set environment variable `baseUrl` = `http://localhost:3000/api`
5. Set `token` after running a login request (copy from response)

### Requests

59 requests covering all endpoints. Login as different roles to test authorization.

## 5. API Testing Checklist

### Auth Module
- [ ] Register new user → 201, returns token
- [ ] Register duplicate email → 409
- [ ] Login valid credentials → 200, returns token
- [ ] Login wrong password → 401
- [ ] Login non-existent email → 401
- [ ] Get /auth/me with valid token → 200
- [ ] Get /auth/me without token → 401
- [ ] Update /auth/profile with valid token → 200; verify name remains after login
- [ ] Update /auth/profile without token → 401
- [ ] Update /auth/profile with invalid name or phone → 400
- [ ] Register as organizer → 201

### Organizer Module
- [ ] Become organizer (USER role) → 201
- [ ] Become organizer again → 409
- [ ] Get organizer profile → 200
- [ ] Update organizer profile → 200
- [ ] Upload organizer logo → 200
- [ ] Organizer dashboard summary → 200
- [ ] List pending organizers (admin) → 200
- [ ] Approve organizer (admin) → 200

### Venue Module
- [ ] List venues (admin) → 200
- [ ] Get venue by ID → 200
- [ ] Get non-existent venue → 404
- [ ] Create venue (admin) → 201
- [ ] Create venue missing required fields → 400
- [ ] Update venue → 200
- [ ] Delete venue → 200
- [ ] Access venue as USER → 403

### Artist Module
- [ ] List artists (organizer) → 200
- [ ] Get artist by ID → 200
- [ ] Create artist (organizer) → 201
- [ ] Update artist → 200
- [ ] Upload artist image → 200
- [ ] Delete artist → 200

### Event Module
- [ ] List public events → 200
- [ ] Search events by keyword → 200
- [ ] Get event by slug → 200
- [ ] Get non-existent slug → 404
- [ ] List own events (organizer) → 200
- [ ] Create event (organizer) → 201
- [ ] Create event with invalid venueId → 400
- [ ] Update event → 200
- [ ] Upload banner → 200
- [ ] Upload gallery → 200
- [ ] Assign venue → 200
- [ ] Assign artists → 200
- [ ] Create ticket categories for event → 201
- [ ] Submit event for approval → 200
- [ ] Approve event (admin) → 200
- [ ] Reject event (admin) → 200
- [ ] Update event status (admin) → 200
- [ ] Delete event → 200
- [ ] Delete event not yours → 403
- [ ] List all events (admin) → 200
- [ ] Filter events by status (admin) → 200

### Ticket Category Module
- [ ] List categories for event → 200
- [ ] Create category (organizer) → 201
- [ ] Update category → 200
- [ ] Delete category → 200

### Order Module
- [ ] Checkout with valid items → 201
- [ ] Checkout with 0 quantity → 400
- [ ] Checkout with non-existent category → 400/404
- [ ] Checkout exceeding quota → 400
- [ ] List orders → 200
- [ ] Get order by ID → 200
- [ ] Get other user's order → 403
- [ ] Cancel pending order → 200
- [ ] Cancel already cancelled order → 400

### Payment Module
- [ ] Get snap token for pending order → 200
- [ ] Get snap token for other user's order → 403
- [ ] Webhook with valid signature → 200
- [ ] Webhook with invalid signature → 401

### Ticket Module
- [ ] List user tickets → 200
- [ ] Get ticket by ID → 200
- [ ] Get other user's ticket → 403
- [ ] Scan valid ticket → 200
- [ ] Scan already-used ticket → 400
- [ ] Scan invalid QR code → 404

### Dashboard Module
- [ ] Get statistics (admin) → 200
- [ ] Get monthly sales → 200
- [ ] Get popular events → 200
- [ ] Access dashboard as USER → 403
- [ ] Access dashboard as ORGANIZER → 403

## 6. Validation Test Cases

| Endpoint | Invalid Input | Expected |
|----------|--------------|----------|
| POST /auth/register | `{}` (empty body) | 400 |
| POST /auth/register | `{email: "invalid"}` | 400 |
| POST /auth/register | `{password: "short"}` | 400 |
| POST /auth/login | `{email: "x@x.com", password: "wrong"}` | 401 |
| POST /venues | `{name: "X"}` (missing fields) | 400 |
| POST /events | `{venueId: "not-uuid"}` | 400 |
| POST /orders/checkout | `{items: []}` | 400 |
| POST /tickets/scan | `{}` (missing qrCode) | 400 |
| PUT /venues/:id | `{capacity: -1}` | 400 |
| POST /artists | `{name: "X"}` (name too short) | 400 |

## 7. Authorization Test Cases

| Endpoint | Token | Expected |
|----------|-------|----------|
| GET /venues | None | 401 |
| GET /venues | USER token | 403 |
| POST /events | USER token | 403 |
| POST /organizers/become | ORGANIZER token | 403 |
| PATCH /organizers/admin/:id/approval | ORGANIZER token | 403 |
| GET /dashboard/statistics | USER token | 403 |
| GET /dashboard/statistics | ORGANIZER token | 403 |
| GET /events/admin/all | USER token | 403 |
| DELETE /artists/:id | ADMIN token | 403 |

## 8. Edge Case Test Cases

| Scenario | Expected |
|----------|----------|
| GET /events/slug-that-does-not-exist | 404 |
| GET /orders/00000000-0000-0000-0000-000000000000 | 404 |
| POST /orders/checkout with quantity exceeding quota | 400 |
| POST /orders/checkout for non-PUBLISHED event | 400 |
| POST /orders/:id/cancel on CONFIRMED order | 400 |
| POST /tickets/scan with random UUID | 404 |
| POST /tickets/scan same ticket twice | 400 (second scan) |
| DELETE /events/:id owned by another organizer | 403 |
| POST /auth/register with already-used email | 409 |
| GET /dashboard/monthly-sales?year=1900 | 200 (empty data) |

## 9. Expected Response Format

All API responses follow this structure:

### Success (2xx)
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Created (201)
```json
{
  "success": true,
  "message": "Created",
  "data": { ... }
}
```

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email" }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Missing token"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Forbidden"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Event not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Email already registered"
}
```

## 10. Resetting Test Data

```bash
# Full reset: drops all data, re-runs migrations, re-seeds
npm run db:reset

# Seed only (keeps existing data, upserts seed records)
npm run db:seed
```

## 11. Manual cURL Examples

### Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@konsera.id","password":"Admin123!"}'
```

### Get Dashboard Stats (use token from login response)
```bash
curl http://localhost:3000/api/dashboard/statistics \
  -H "Authorization: Bearer <token>"
```

### Checkout Order
```bash
curl -X POST http://localhost:3000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user-token>" \
  -d '{"eventId":"seed-event-001","items":[{"ticketCategoryId":"seed-tc-002","quantity":2}]}'
```
