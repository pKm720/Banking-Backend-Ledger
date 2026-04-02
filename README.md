# 🏦 Banking Backend Ledger System

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

A robust, secure, and scalable backend system designed to handle core banking operations. This project implements a reliable ledger system, secure money transfers with idempotency, and comprehensive API documentation.

---

## 🚀 Key Features

- **🔐 Secure Authentication**: Multi-layered security using JWT (JSON Web Tokens) and Bcrypt for password hashing.
- **📊 Double-Entry Ledger**: Every transaction is recorded as a linked Debit and Credit entry, ensuring accounting integrity.
- **⚡ Atomic Transactions**: Utilizes MongoDB Sessions/Transactions to ensure that money transfers either succeed completely or fail gracefully (ACID compliance).
- **🛡️ Idempotency**: Built-in protection against duplicate transactions using unique idempotency keys.
- **📧 Automated Notifications**: Integrated email service to notify users of successful transactions.
- **🔒 Security First**: implementation of Helmet for HTTP headers, Morgan for logging, and Rate Limiting to prevent brute-force attacks.
- **📖 Live API Documentation**: Fully interactive Swagger documentation for seamless API testing.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Documentation**: Swagger UI & Swagger JSDoc
- **Security**: JWT, Bcrypt, Helmet, Express-Rate-Limit
- **Logging**: Morgan
- **Deployment Ready**: Optimized for platforms like Render

---

## 📖 API Documentation (Swagger)

The API is fully documented using Swagger. You can explore and test all endpoints directly from the browser.

### 🌐 Live Production Link
Access the API docs here: [Live Documentation](https://banking-backend-ledger.onrender.com/api-docs/)

### 💻 Local Development
If running locally, access the docs at:
`http://localhost:3000/api-docs`

> **Note**: In the Swagger UI, use the **Servers** dropdown at the top to switch between the Localhost and Production environments.

---

## 📂 Project Structure

```text
├── src
│   ├── config         # Database and Swagger configurations
│   ├── controllers    # Business logic for Auth, Accounts, and Transactions
│   ├── middlewares    # Auth guards and request limiters
│   ├── models         # Mongoose schemas (User, Account, Transaction, Ledger)
│   ├── routes         # API route definitions
│   ├── services       # Email and other third-party integrations
│   └── app.js         # Express app initialization
├── server.js          # Entry point of the application
└── .env               # Environment variables
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pKm720/Banking-Backend-Ledger.git
   cd Banking-Backend-Ledger
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URL=your_mongodb_connection_string
   JWT_SEC=your_secret_key
   EMAIL_USER=your_email@gmail.com
   APP_PASSWORD=your_app_password
   NODE_ENV=development
   PORT_ENV=3000
   ```

4. **Run the server**:
   ```bash
   npm start
   ```

---

## 🏗️ How It Works (The Core Logic)

### The Ledger System
Unlike simple balance updates, this system uses a **Ledger Model**. When User A sends money to User B:
1. A **Transaction** is created with a `PENDING` status.
2. A **DEBIT** entry is created for User A.
3. A **CREDIT** entry is created for User B.
4. The Transaction status is updated to `COMPLETED`.
5. All these steps are wrapped in a **Mongoose Session**—if any step fails, the entire operation is rolled back.

### Idempotency
To prevent accidental double-spending (e.g., if a user clicks "Send" twice), every transaction requires an `idempotencyKey`. The system checks if a transaction with that key already exists before processing.

---

## 👨‍💻 About the Author

I am a passionate Backend Developer focused on building secure and high-performance financial systems. This project demonstrates my ability to handle complex database operations, implement security best practices, and deliver professional-grade documentation.

**Looking for a dedicated developer for your team? Let's connect!**

- **GitHub**: [pKm720](https://github.com/pKm720)
- **LinkedIn**: [Priyanshu Mahato](https://linkedin.com/in/your-profile) *(Update with your actual link)*
- **Portfolio**: [Visit My Work](https://your-portfolio.com) *(Update with your actual link)*

---
*Created with ❤️ for a secure financial future.*
