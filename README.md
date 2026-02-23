# RudBank - Modern Banking Dashboard 🏦

RudBank is a full-stack banking application with a secure backend API and a modern Single Page Application (SPA) frontend. Built with Node.js, Express, PostgreSQL, and vanilla JavaScript.

## 🌟 Live Demo

**Production URL:** [https://rudbank.vercel.app](https://rudbank.vercel.app)

## ✨ Features

### Frontend (SPA)
- ✅ **Dashboard**: Real-time balance, transactions, stats, and analytics
- ✅ **Analytics**: Spending breakdown, financial insights, and trends  
- ✅ **Cards**: Virtual and physical card management
- ✅ **Assets**: Investment portfolio and holdings tracking
- ✅ **Profile**: Account settings and security options
- ✅ **Hash-based Routing**: Smooth navigation without page reloads
- ✅ **Responsive Design**: Mobile, tablet, and desktop optimized
- ✅ **Modern UI**: Glass morphism, smooth animations, dark theme

### Backend API
- ✅ **JWT Authentication**: Secure HttpOnly cookie-based auth
- ✅ **Transaction Management**: Credit/debit operations
- ✅ **Balance Tracking**: Real-time balance updates
- ✅ **Transaction History**: Complete audit trail
- ✅ **Security**: Bcrypt hashing, CORS protection, input validation

## 🚀 Tech Stack

### Frontend
*   **HTML5/CSS3**: Modern, responsive UI
*   **Vanilla JavaScript (ES6+)**: No framework dependencies
*   **Hash-based Router**: SPA navigation system
*   **Lucide Icons**: Beautiful icon library
*   **Glass Morphism**: Modern design aesthetic

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL (Neon cloud)
*   **Authentication**: JWT with HttpOnly Cookies
*   **Security**: Bcrypt, CORS, CSP headers

### Deployment
*   **Vercel**: Serverless deployment
*   **GitHub**: Version control
*   **Neon**: Cloud PostgreSQL database

## 📁 Project Structure

```
rudbank/
├── public/                      # Frontend (SPA)
│   ├── index.html              # Main HTML shell
│   ├── script.js               # App initialization
│   ├── style.css               # Global styles
│   ├── js/
│   │   ├── router.js           # SPA routing system
│   │   └── api.js              # API service layer
│   ├── components/
│   │   ├── dashboard.js        # Dashboard view
│   │   ├── analytics.js        # Analytics view
│   │   ├── cards.js            # Cards view
│   │   ├── assets.js           # Assets view
│   │   └── profile.js          # Profile view
│   └── styles/
│       └── components.css      # Component styles
│
├── src/                        # Backend API
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js # Authentication logic
│   │   └── bank.controller.js # Banking operations
│   ├── middlewares/
│   │   ├── auth.middleware.js # JWT verification
│   │   └── error.middleware.js# Error handling
│   ├── routes/
│   │   ├── auth.routes.js     # Auth endpoints
│   │   └── bank.routes.js     # Bank endpoints
│   └── server.js              # Express server
│
├── ARCHITECTURE.md             # Complete architecture guide
├── IMPLEMENTATION_SUMMARY.md   # Implementation overview
├── TESTING_GUIDE.md           # Testing instructions
├── QUICK_REFERENCE.md         # Developer quick reference
├── NAVIGATION_FLOW.md         # Flow diagrams
└── package.json               # Dependencies
```

## 🛠️ Setup Instructions

### 1. Prerequisites
*   Node.js (v18+)
*   PostgreSQL (local) or Neon (cloud)

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
JWT_EXPIRES_IN=1d
CORS_ORIGIN=*
GOOGLE_CLIENT_ID=your_google_client_id
```

**For Neon Cloud Database:**
```env
DATABASE_URL=postgresql://username:password@host.region.aws.neon.tech/database?sslmode=require
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
    balance DECIMAL(15, 2) DEFAULT 100000.00,
    profile_image TEXT
);

CREATE TABLE UserToken (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    uid INTEGER REFERENCES KodUser(id),
    expiry TIMESTAMP NOT NULL
);

CREATE TABLE Transactions (
    id SERIAL PRIMARY KEY,
    uid INTEGER REFERENCES KodUser(id),
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Running the App
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start

# Test API endpoints (requires server running)
node test-api.js
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
*   **CORS Protection**: Configurable origin restrictions for production.
*   **SSL Support**: Database connections secured with SSL in production.

## 🐛 Troubleshooting

### Login returns 400 error
- Verify username exists in database
- Check password is correct
- Review server logs for specific error message

### Dashboard not loading after login
- Check browser console for CORS errors
- Verify `CORS_ORIGIN` environment variable matches your domain
- Ensure cookies are enabled in browser
- Check Network tab for failed API calls

### Profile endpoint returns 500 error
- Verify database connection is working
- Check that `id` column exists in `koduser` table (not `uid`)
- Review Vercel/server logs for detailed error

### Cookies not being set
- Ensure `secure: true` and `sameSite: "none"` for cross-origin
- Verify HTTPS is enabled (required for secure cookies)
- Check CORS configuration allows credentials

### Database connection errors
- Verify `DATABASE_URL` is correct
- For Neon: Ensure `?sslmode=require` is in connection string
- Check database is accessible from your deployment region
- Verify SSL configuration matches your database provider

For detailed debugging steps, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📚 Documentation

### For Developers
- **[ARCHITECTURE.md](ARCHITECTURE.md)**: Complete architecture guide
  - SPA routing system
  - Component structure  
  - Best practices
  - Adding new features

- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)**: Developer quick reference
  - Common commands
  - API calls
  - CSS classes
  - Utility functions

- **[NAVIGATION_FLOW.md](NAVIGATION_FLOW.md)**: Visual flow diagrams
  - Navigation flow
  - Data flow
  - Authentication flow
  - Component lifecycle

### For Testing
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)**: Comprehensive testing guide
  - Manual testing checklist
  - Browser console testing
  - Network tab verification
  - Troubleshooting

### For Overview
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**: Feature summary
  - What was implemented
  - How it works
  - Key benefits

### Additional Resources
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment and debugging guide
- [API Testing](./test-api.js) - Automated API testing script

## 📚 Additional Resources
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment and debugging guide
- [API Testing](./test-api.js) - Automated API testing script


## 🎯 Quick Start

1. **Clone and install**
   ```bash
   git clone https://github.com/Mosinali10/rudbank.git
   cd rudbank
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database and JWT secret
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 👨‍💻 Author

**Mosin Ali**
- GitHub: [@Mosinali10](https://github.com/Mosinali10)

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ for modern banking experiences**
