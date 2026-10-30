# Library Management System

A full-stack MERN application for managing books, members, and borrowing transactions.

## Run Locally

**Prerequisites:** Node.js

1. Install root dependencies:
   `npm install`
2. Install server dependencies:
   `npm install --prefix server`
3. Set `MONGODB_URI` in the root `.env` file to connect MongoDB. Without it, the app uses in-memory demo data.
4. Run the full-stack server, which serves both the API and frontend:
   `npm run dev`

Alternatively, run `npm run dev` in `server` and `npm run dev` in `client` in separate terminals. The client dev server proxies `/api` requests to `http://localhost:3000`.
