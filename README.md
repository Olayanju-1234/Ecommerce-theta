# Ecommerce API

A production-ready e-commerce REST API with role-based access control, product management, order processing, and transactional email — built with Node.js, TypeScript, Express, and MongoDB.

## Features

- **Role-Based Access Control** — Distinct permissions for buyers, sellers, and admins
- **Product Management** — CRUD with image uploads (Cloudinary), tagging, and reviews
- **Order Management** — Order lifecycle tracking per user role
- **Authentication** — JWT access/refresh tokens, OTP verification, bcrypt password hashing
- **Transactional Email** — Template-based emails via Nodemailer (registration, OTP, order events)
- **API Documentation** — Swagger UI at `/api/docs`
- **Input Validation** — Request validation with Celebrate and express-validator
- **Media Uploads** — Multer + Cloudinary for image handling

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + TypeScript |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcryptjs, otplib |
| File Uploads | Multer + Cloudinary |
| Email | Nodemailer + email-templates (Pug) |
| Validation | Celebrate (Joi), express-validator |
| Docs | Swagger UI (swagger-jsdoc) |

## API Overview

### Auth — `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate and receive tokens |
| POST | `/refresh` | Refresh access token |
| POST | `/verify-otp` | Verify OTP for account activation |
| POST | `/forgot-password` | Initiate password reset |
| POST | `/reset-password` | Complete password reset |

### Products — `/api/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all products (paginated, filterable) |
| GET | `/:id` | Get product details |
| POST | `/` | Create product _(seller/admin)_ |
| PATCH | `/:id` | Update product _(seller/admin)_ |
| DELETE | `/:id` | Delete product _(seller/admin)_ |
| POST | `/:id/reviews` | Add a review _(buyer)_ |

### Users — `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get current user profile |
| PATCH | `/me` | Update profile |
| GET | `/` | List all users _(admin)_ |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Cloudinary account
- SMTP credentials (Gmail or similar)

### Setup

```bash
git clone https://github.com/Olayanju-1234/Ecommerce-theta.git
cd Ecommerce-theta
yarn install
cp .env.example .env   # fill in your values
yarn dev
```

API docs are available at `http://localhost:{PORT}/api/docs`

## Environment Variables

```env
NODE_ENV=development
PORT=3000
LOCAL_PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Email
EMAIL=your@email.com
EMAIL_PASSWORD=your_password
EMAIL_SERVICE=gmail
EMAIL_PORT=587
EMAIL_HOST=smtp.gmail.com
EMAIL_SECURE=false
EMAIL_FROM=your@email.com

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# App
BASE_URL=http://localhost:3000
APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── config/          # Env validation, DB connection, Swagger config
├── controllers/     # Route handlers (auth, products, users)
├── middlewares/     # Auth guard, error handling, upload, validation
├── models/          # Mongoose schemas (User, Product, Order, Review, Tag)
├── routes/          # Express route definitions
├── services/        # Business logic layer
├── types/           # TypeScript interfaces and type definitions
└── utils/           # Helpers (tokens, email, OTP)
```

## Live Demo

Frontend: [angular-ecommerce-theta-two.vercel.app](https://angular-ecommerce-theta-two.vercel.app/)
