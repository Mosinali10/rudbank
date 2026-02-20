# RudBank Backend 🏦

RudBank is a secure, production-grade banking API built with Node.js, Express, and PostgreSQL. It features robust authentication, real-time balance management, and secure transaction processing.

## 🚀 Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **Authentication**: JWT (JSON Web Tokens) with HttpOnly Cookies
*   **Security**: Bcrypt (Hashing), Manual Security Headers (HSTS, CSP, Frame Options)
*   **Logging/Development**: Nodemon

## 🛠️ Setup Instructions

### 1. Prerequisites
*   Node.js (v18+)
*   PostgreSQL

### 2. Installation
```bash
git clone https://github.com/Mosinali10/rudbank.git
cd rudbank
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/rudbank
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=*
```

### 4. Database Schema
Ensure the following tables exist in your PostgreSQL database:

```sql
CREATE TABLE KodUser (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer',
    balance DECIMAL(15, 2) DEFAULT 100000.00
);

CREATE TABLE UserToken (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    uid INTEGER REFERENCES KodUser(id),
    expiry TIMESTAMP NOT NULL
);
```

### 5. Running the App
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

## 🔌 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get HttpOnly token | No |
| POST | `/api/auth/logout` | Clear session and token | Yes |

### 💰 Banking
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/bank/profile` | Get user details and balance | Yes |
| GET | `/api/bank/balance` | Get current balance | Yes |
| POST | `/api/bank/credit` | Add funds to account | Yes |
| POST | `/api/bank/debit` | Withdraw funds from account | Yes |

### 🩺 System
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/api/health` | API Health check | No |

## 🛡️ Response Format

All responses follow a standardized format:

**Success (200 OK):**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error (400/500):**
```json
{
  "success": false,
  "message": "..."
}
```

## 🔒 Security Features
*   **HttpOnly Cookies**: Prevents client-side scripts from accessing JWT.
*   **Centralized Error Handling**: No sensitive stack traces leaked to clients.
*   **Strict Validation**: All financial transactions are validated for positive numeric values.
*   **Startup Cleanup**: Expired tokens are automatically purged from the database on server start.
