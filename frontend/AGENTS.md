# Konsera AI Development Guide

## Project Overview

Project Name: Konsera

Tagline:
Discover. Book. Experience.

Konsera is a startup-style concert ticketing platform built for web and mobile.

The application consists of:

- REST API Backend
- Web Admin Dashboard
- Mobile Application
- Payment Gateway
- QR Ticket
- Analytics Dashboard

This project is intended for:

- UKK RPL
- Portfolio
- Production-ready architecture

---

# Tech Stack

## Backend

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT
- Bcrypt
- Multer
- Cloudinary

## Web

- Next.js
- Tailwind CSS
- shadcn/ui
- Zustand
- React Hook Form
- Axios
- Zod

## Mobile

- React Native Expo
- Expo Router
- NativeWind
- Axios

## Database

MySQL

Do not use SQLite.

---

# Project Architecture

Always use Clean Architecture.

```
Controller
↓
Service
↓
Repository
↓
Database
```

Never place database queries directly inside controllers.

---

# Folder Structure

```
backend/

src/

controllers/

services/

repositories/

routes/

middlewares/

validations/

utils/

config/

prisma/

uploads/
```

```
web/

app/

components/

features/

hooks/

services/

store/

types/

constants/
```

```
mobile/

app/

components/

hooks/

services/

store/

types/

utils/
```

---

# Database Rules

Database First.

Do not redesign the database without approval.

Use:

- snake_case
- singular column names
- plural table names

Example

users

events

ticket_categories

order_items

Always include

created_at

updated_at

Use Foreign Keys.

Avoid duplicated data.

---

# User Roles

There are exactly four roles.

1. USER

Can

- Register
- Login
- Buy Ticket
- Wishlist
- View History
- View QR Ticket

Cannot

- Manage Events
- Access Dashboard

---

2. ORGANIZER

Can

- Create Event
- Edit Own Event
- Manage Ticket Categories
- Manage Artists
- View Sales
- Scan QR Ticket

Cannot

- Approve Events
- Manage Users

---

3. ADMIN

Can

- Approve Organizer
- Approve Event
- Manage Users
- View Reports

Cannot

- Manage Super Admin

---

4. SUPER_ADMIN

Has full access.

Can

- Manage Admin
- Manage Roles
- Manage Settings
- View Global Analytics
- Audit Logs

---

# Coding Rules

Always use TypeScript.

Always use async/await.

Never use "any" unless absolutely necessary.

Use reusable components.

Keep components small.

Separate business logic.

Prefer composition over duplication.

---

# API Rules

REST API only.

Use consistent endpoints.

Examples

POST /api/auth/login

POST /api/auth/register

GET /api/events

GET /api/events/:slug

POST /api/orders

POST /api/payments

POST /api/payment/webhook

Return JSON.

Never return HTML.

---

# Authentication

Use JWT.

Passwords must be hashed using bcrypt.

Protect routes using middleware.

Implement Role Based Access Control.

---

# Payment

Payment Gateway:

Midtrans Sandbox

Flow

User

↓

Checkout

↓

Create Order

↓

Generate Snap Token

↓

Payment

↓

Webhook

↓

Update Order

↓

Generate Ticket

↓

Generate QR Code

---

# UI Rules

Style

- Modern
- Minimal
- Startup
- Responsive

Do not use Bootstrap.

Use Tailwind CSS.

---

# Color Palette

Primary

#468189

Secondary

#77ACA2

Accent

#9DBEBB

Background

#F8FAFC

Surface

#FFFFFF

Border

#E5E7EB

Text

#1F2937

---

# Components

Always reuse components.

Examples

Button

Input

Modal

Card

Badge

Dialog

Navbar

Sidebar

Table

Pagination

Empty State

Loading Skeleton

---

# Naming Convention

Components

PascalCase

Example

UserCard.tsx

Navbar.tsx

DashboardCard.tsx

Variables

camelCase

Functions

camelCase

Database

snake_case

---

# Git Rules

Main Branch

main

Development Branch

develop

Feature Branch

feature/auth

feature/events

feature/payment

feature/mobile

---

# Documentation

Whenever adding a feature:

Update

- API Documentation
- Database Documentation
- README
- Testing Documentation

---

# Important Rules

Do not change architecture.

Do not invent database tables.

Do not change folder structure.

Always explain implementation decisions.

Always generate scalable code.

Prioritize readability over cleverness.

When uncertain, ask before changing the architecture.