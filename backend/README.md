# BlockRights Backend API

Backend API untuk platform verifikasi karya digital BlockRights.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

```bash
# Copy environment file
cp env.example .env

# Edit .env file dengan konfigurasi database Anda
```

### 3. Database Setup

```bash
# Jalankan SQL schema
mysql -h pintu2.minecuta.com -u hackaton -p blockrights < database/schema.sql
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

## 📊 Database Configuration

- **Host**: pintu2.minecuta.com
- **Port**: 3306
- **Username**: hackaton
- **Password**: hackaton
- **Database**: blockrights

## 🔐 API Endpoints

### Authentication

#### POST `/api/auth/register`

Register user baru

```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "walletAddress": "0x..." // optional
}
```

#### POST `/api/auth/login`

Login user

```json
{
  "email": "john@example.com", // atau username
  "password": "password123",
  "rememberMe": false // optional
}
```

#### GET `/api/auth/me`

Get current user info (requires Bearer token)

## 🛡️ Security Features

- Password hashing dengan bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Input validation dengan Joi
- SQL injection protection

## 📝 Environment Variables

```env
DB_HOST=pintu2.minecuta.com
DB_PORT=3306
DB_USER=hackaton
DB_PASSWORD=hackaton
DB_NAME=blockrights
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```
