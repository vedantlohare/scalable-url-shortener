# Scalable URL Shortener

A production-style URL shortening service built using Node.js, Express, PostgreSQL, Redis and Docker.

## Features

* User Signup and Login
* JWT Authentication
* URL Shortening
* Custom URL Aliases
* URL Expiry
* Click Analytics
* User-specific URL Management
* Redis Caching
* Dockerized Deployment
* RESTful API Architecture

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Redis
* Docker
* JWT
* bcrypt

## Architecture

Client → Express → Controllers → Services → Models → PostgreSQL

Client → Express → Redis Cache → PostgreSQL

## API Endpoints

### Authentication

POST /auth/signup

POST /auth/login

### URLs

POST /shorten

GET /my-urls

GET /analytics/:shortCode

GET /:shortCode

## Running Locally

```bash
npm install
npm run dev
```

## Running with Docker

```bash
docker compose up --build
```
