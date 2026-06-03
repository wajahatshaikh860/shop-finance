# Shop Finance Manager

A production-ready finance management dashboard for shopkeepers to record daily cash income, online income, cash expenses, online expenses, and daily net balance.

## Features

- Next.js App Router frontend with Tailwind CSS
- React Context API for authentication and dashboard state
- JWT authentication with protected dashboard routes
- Express.js API with MongoDB Atlas and Mongoose
- bcrypt password hashing
- Daily transaction form with validation
- Date and month filters without page refresh
- Daily grouped summary table
- Invoice-style daily report modal
- PDF export for all or filtered reports
- Mobile responsive sidebar drawer

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

3. Fill in:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/shopFinanceDB
JWT_SECRET=your-long-random-secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
CLIENT_URL=http://localhost:3000
PORT=5000
```

For local MongoDB shell, connect with:

```bash
mongosh "mongodb://127.0.0.1:27017/shopFinanceDB"
```

4. Start the backend:

```bash
npm run backend:dev
```

5. Start the frontend in another terminal:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

API: `http://localhost:5000/api`

## First User

Register a shopkeeper account before logging in:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Shop Owner\",\"email\":\"owner@shop.com\",\"password\":\"password123\"}"
```

Then log in at `/login`, or create an account from `/signup`.

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `POST /api/transactions`
- `GET /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
