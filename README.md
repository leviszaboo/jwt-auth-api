# JWT Authentication Service

A production-ready REST API for user authentication using JSON Web Tokens (JWT).

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Setup](#setup)
- [Security](#security)
- [Testing](#testing)
- [License](#license)

## Overview

This JWT Authentication API provides a secure user authentication system built with TypeScript and Express. It implements industry-standard security practices with JWT for managing users and secure API access. Below is a graphical overview of the system:

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/71a052bf-72a6-4b5c-9ca5-bb76b4bc1ee7" 
    alt="Screenshot 2025-09-14 at 21 57 38" 
    width="717" height="999" 
    style="padding: 30px;" 
  />
  <img 
    src="https://github.com/user-attachments/assets/7e02e18a-f534-4d1f-b6ff-207ad563cd80" 
    alt="Screenshot 2025-09-14 at 21 34 19" 
    width="566" height="520" 
    style="padding: 30px;" 
  />
</p>
## Features

- **User Authentication**
  - Secure sign-up and login with password hashing
- **JWT Token Management**
  - Access and refresh token implementation
  - Automatic token reissue
  - Token blacklisting for security
  - Secure httpOnly cookies
- **User Management**
  - User profile retrieval
  - Email & password updates
  - Account deletion
- **Developer Experience**
  - OpenAPI documentation
  - Comprehensive test coverage
  - TypeScript for enhanced code quality

## Technologies

- **Backend**: Node.js, Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt for password hashing
- **Testing**: Vitest, Supertest
- **Documentation**: OpenAPI/Swagger
- **Containerization**: Docker

## Installation

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Variables

Before running the service, create an `.env` file in the project root. A sample configuration looks like this:

```bash

DATABASE_URL=postgresql://user:password@postgres:5432/postgres?schema=public
POSTGRES_PASSWORD=password
API_KEY="api-key"
BCRYPT_SALT=10

ACT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
<your-access-token-private-key>
-----END RSA PRIVATE KEY-----"

ACT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
<your-access-token-public-key>
-----END PUBLIC KEY-----"

RFT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
<your-refresh-token-private-key>
-----END RSA PRIVATE KEY-----"

RFT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
<your-refresh-token-public-key>
-----END PUBLIC KEY-----"
```

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/jwt-auth-service.git
   cd jwt-auth-service
   ```
2. Create a `.env` file as described above.
3. Build and start the services with Docker Compose:
   ```
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```
4. The API should be accessible at `http://localhost:80`. Visit `http://localhost:80/docs` for documentation.

## Security

Several security best practices are implemented:

- Passwords are stored using bcrypt (salted and hashed)
- JWT signed with RS256 algorithm (asymmetric)
- Secure HttpOnly cookies for token storage
- Token blacklisting for invalidated sessions
- API key verification for all endpoints
- Input validation using Zod schemas
- Protection against common web vulnerabilities

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
