# LibreStack Library Management System

LibreStack is a full-stack library circulation app for managing a book catalog, member accounts, and book loans. Its dashboard tracks inventory and activity, while the circulation ledger calculates holding fees and overdue penalties.

## Features

- **Dashboard:** View catalog, copy, member, loan, overdue, and fee metrics; see recent activity and low-stock books.
- **Book catalog:** Add, edit, and remove titles; search by title, author, or ISBN; filter by category and stock; switch between grid and table views.
- **Member directory:** Register, edit, search, and filter members by status.
- **Circulation:** Issue books to active members, record due dates and notes, process returns, and view transaction receipts.
- **Fee tracking:** Assign a daily holding rate by book popularity, calculate accrued holding fees and late penalties, and display totals in the dashboard and ledger.
- **REST API:** The React app uses the Express API for catalog, member, transaction, and statistics data.

### Holding rates

| Popularity | Daily holding rate |
| --- | ---: |
| High | $1.50 |
| Medium | $1.00 |
| Standard | $0.50 |

Loans default to a 14-day term when no due date is provided. Overdue loans accrue an additional $1.00 per late day. The holding rate is recorded when a book is issued.

## Tech stack

- **Frontend:** React 19, Vite 8, plain CSS, and Lucide icons
- **Backend:** Node.js, Express 4, and Mongoose
- **Database:** MongoDB when `MONGODB_URI` is configured; otherwise an in-memory demo store

## Requirements

- Node.js 20.19+ (or 22.12+) and npm
- MongoDB, if you want data to persist between server restarts

## Run locally

From the project root:

1. Install the root and server dependencies:

   ```sh
   npm install
   npm install --prefix server
   ```

2. Configure the environment. Copy `.env.example` to `.env` in the project root, then set `MONGODB_URI` to your MongoDB connection string if you want persistent storage. Keep `.env` private and do not commit it.

   ```dotenv
   MONGODB_URI=mongodb://127.0.0.1:27017/library_management
   PORT=3000
   ```

   For MongoDB Atlas, use the connection string provided by your cluster. Make sure the database user and network access rules are configured.

   If `MONGODB_URI` is unset or left as the placeholder in `.env.example`, the server starts with sample in-memory data. Changes in this mode are lost when the server stops.

3. Start the app:

   ```sh
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). The API is available under `/api`.

The root development command starts Express and serves the Vite frontend through middleware. To run the Vite development server separately instead, start these in two terminals:

```sh
npm run dev --prefix server
npm run dev --prefix client
```

In this setup, the client runs on Vite's default development port and proxies `/api` requests to `http://localhost:3000`.

## Production build

Build the frontend assets:

```sh
npm run build
```

The build is written to `dist/`. Start the server in production mode to serve those assets:

PowerShell:

```powershell
$env:NODE_ENV = "production"
npm start
```

POSIX shell:

```sh
NODE_ENV=production npm start
```

Set `PORT` and `MONGODB_URI` in the server environment as appropriate. The server defaults to port `3000`.

## REST API

All endpoints are relative to `/api`. JSON request bodies are expected for create, update, issue, and return operations.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Server health and MongoDB connection status |
| `GET` | `/books` | List books; optional `category`, `search`, and `popularity` filters |
| `GET` | `/books/:id` | Get a book |
| `POST` | `/books` | Add a book |
| `PUT` | `/books/:id` | Update a book |
| `DELETE` | `/books/:id` | Delete a book if it has no active loans |
| `GET` | `/members` | List members; optional `search` and `status` filters |
| `GET` | `/members/:id` | Get a member |
| `POST` | `/members` | Register a member |
| `PUT` | `/members/:id` | Update a member |
| `DELETE` | `/members/:id` | Delete a member if they have no active loans |
| `GET` | `/transactions` | List transactions; optional `status`, `memberId`, and `bookId` filters |
| `GET` | `/transactions/:id` | Get a transaction |
| `POST` | `/transactions/issue` | Issue a book (`bookId`, `memberId`, optional `issueDate`, `dueDate`, and `notes`) |
| `PUT` | `/transactions/:id/return` | Return a book (optional `returnDate`) |
| `GET` | `/stats` | Get dashboard and circulation statistics |
| `POST` | `/stats/reset` | Restore the in-memory demonstration data |

The reset endpoint resets the in-memory demo store; it does not erase MongoDB collections.

## Project layout

```text
.
├── client/
│   └── src/
│       ├── components/   # Forms, modals, navigation, and notifications
│       ├── pages/        # Dashboard, books, members, and transactions
│       └── services/     # Frontend API client
├── server/
│   ├── config/           # MongoDB connection and demo data
│   ├── controllers/      # API request handlers
│   ├── models/           # Book, member, and transaction models
│   └── routes/           # Express API routes
├── index.html
├── server.js             # Root server entry point
└── vite.config.ts
```
