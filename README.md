# Scalable URL Shortener

A production-style URL Shortener built using **Node.js, Express, PostgreSQL, Redis and Docker**.

The application allows authenticated users to create shortened URLs, manage their links, track click analytics, configure URL expiry and leverage Redis caching for faster redirects.

---

# Table of Contents

* Overview
* Features
* System Architecture
* Tech Stack
* Database Design
* API Endpoints
* Authentication Flow
* Redis Caching Strategy
* Project Structure
* Local Setup
* Docker Setup
* Testing Guide
* Future Improvements
* Key Learnings

---

# Overview

Modern URL shortening services such as Bitly and TinyURL allow users to convert long URLs into compact, shareable links.

This project implements the core functionality of a scalable URL shortening service while incorporating industry-standard backend engineering practices:

* Layered Architecture
* JWT Authentication
* PostgreSQL Persistence
* Redis Caching
* Docker Containerization
* RESTful APIs

The goal of the project is not only to shorten URLs but also to demonstrate backend system design concepts commonly used in production applications.

---

# Features

## User Management

* User Signup
* User Login
* Password Hashing using bcrypt
* JWT Authentication
* Protected Routes

## URL Management

* Generate Short URLs
* Custom URL Aliases
* User-specific URL Ownership
* URL Expiration Support
* URL Redirection

## Analytics

* Click Tracking
* URL Statistics Endpoint
* User Dashboard

## Performance Optimization

* Redis Caching Layer
* Reduced Database Lookups
* Faster Redirect Responses

## DevOps

* Docker Support
* Docker Compose Support
* Environment Variable Configuration

---

# System Architecture

```text
                 ┌─────────────┐
                 │   Client    │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  Express API│
                 └──────┬──────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
      Redis Cache            PostgreSQL
            │                       │
            └───────────┬───────────┘
                        │
                        ▼
                  API Response
```

---

# Application Architecture

The project follows a layered architecture.

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
Database
```

### Routes

Responsible for API endpoint definitions.

### Controllers

Handle incoming requests and outgoing responses.

### Services

Contain business logic.

### Models

Interact directly with PostgreSQL.

### Database

Stores users and URL data.

---

# Tech Stack

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

## Authentication

* JWT (JSON Web Tokens)
* bcrypt

## Caching

* Redis

## Containerization

* Docker
* Docker Compose

---

# Database Design

## Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Purpose

Stores registered user information.

---

## URLs Table

```sql
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(20) UNIQUE,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    user_id INTEGER REFERENCES users(id)
);
```

### Purpose

Stores shortened URLs and ownership information.

---

# Authentication Flow

```text
User Login
     │
     ▼
Validate Credentials
     │
     ▼
Generate JWT
     │
     ▼
Return Token
     │
     ▼
Protected Endpoints
```

The token must be supplied in the Authorization header.

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# Redis Caching Strategy

Without Redis:

```text
Request
   ↓
PostgreSQL
   ↓
Response
```

With Redis:

```text
Request
   ↓
Redis
   ↓
Cache Hit?
   ├── Yes → Response
   └── No
         ↓
     PostgreSQL
         ↓
     Store in Redis
         ↓
      Response
```

Benefits:

* Reduced database load
* Faster redirects
* Better scalability

---

# API Endpoints

## Authentication

### Signup

```http
POST /auth/signup
```

Request:

```json
{
    "username":"Vedant",
    "email":"vedant@test.com",
    "password":"password123"
}
```

---

### Login

```http
POST /auth/login
```

Request:

```json
{
    "email":"vedant@test.com",
    "password":"password123"
}
```

Response:

```json
{
    "token":"JWT_TOKEN"
}
```

---

## URL Operations

### Create Short URL

```http
POST /shorten
```

Authorization Required.

Request:

```json
{
    "originalUrl":"https://github.com",
    "customAlias":"github",
    "expiryDays":30
}
```

Response:

```json
{
    "shortUrl":"http://localhost:3000/github"
}
```

---

### Get User URLs

```http
GET /my-urls
```

Returns all URLs created by the authenticated user.

---

### Analytics

```http
GET /analytics/:shortCode
```

Returns:

```json
{
    "short_code":"github",
    "clicks":42,
    "created_at":"..."
}
```

---

### Redirect

```http
GET /:shortCode
```

Redirects to the original URL.

---

# Project Structure

```text
url-shortener/

├── src
│   ├── config
│   │   ├── db.js
│   │   └── redis.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   └── urlController.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── models
│   │   ├── userModel.js
│   │   └── urlModel.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   └── urlRoutes.js
│   │
│   └── services
│       ├── authService.js
│       └── urlService.js
│
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── README.md
```

---

# Running Locally

## Clone Repository

```bash
git clone <repo-url>
cd scalable-url-shortener
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create:

```text
.env
```

using:

```text
.env.example
```

---

## Start Server

```bash
npm run dev
```

---

# Running With Docker

Build and start all services:

```bash
docker compose up --build
```

Services Started:

* Node.js Application
* PostgreSQL
* Redis

---

# Testing Guide

Recommended Tool:

* Postman

Test Sequence:

1. Signup
2. Login
3. Copy JWT Token
4. Create URL
5. Open Short URL
6. Verify Analytics
7. Verify My URLs

---

# Future Improvements

Potential enhancements:

* Rate Limiting
* QR Code Generation
* URL Tags
* URL Search
* Role-Based Access Control
* Admin Dashboard
* Kubernetes Deployment
* CI/CD Pipeline
* Distributed Caching

---

# Key Learnings

This project demonstrates practical experience with:

* REST API Development
* Database Design
* Authentication & Authorization
* Redis Caching
* Docker Containerization
* Backend Architecture
* PostgreSQL Querying
* Environment Configuration
* Error Handling
* Production-Oriented Design

---

# Author

Vedant Lohare

