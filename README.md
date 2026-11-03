# Expenses App

A full-stack personal finance tracker built with Next.js 14, focused on budget control across cash and card payment methods. Track expenses, manage pending payments, and visualize your financial period at a glance.

**Live demo:** https://expenses-app-2.vercel.app

> Demo login available, or sign in with Google (upon request).

---

## Screenshots

### Landing Page
![Landing Page](screenshots/landing-desktop.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Expenses Table — Desktop
![Expenses Table Desktop](screenshots/expenses-desktop1.png)

### Expenses Table — Mobile
![Expenses Table Mobile](screenshots/expenses-mobile1.png)

### Reports
![Reports](screenshots/reports.png)

---

## Features

- **Period-based budgeting** — create an expenses table for a time period, set cash and card income separately, close it when done
- **Expense tracking** — add, edit, and delete expenses with payment method tagging (cash or card)
- **Pending payments** — track upcoming financial commitments separately from recorded expenses; link expenses to pending items as payments are made
- **Budget visualization** — dashboard charts showing income vs spent vs pending vs remaining, cash/card split, and pending fulfillment status
- **Quick actions** — add an expense directly from the dashboard without navigating to the expenses module
- **Authentication** — credentials-based login and Google OAuth; JWT sessions with 7-day expiration
- **Accessibility** — zero errors on WAVE and axe audits

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | MongoDB (direct connection, no ORM) |
| Auth | NextAuth v4 — JWT strategy, credentials + Google OAuth |
| Server state | TanStack Query v5 |
| Forms | React Hook Form v7 |
| Charts | Recharts |
| Styling | Tailwind CSS + Material Tailwind |
| Testing | Jest + Testing Library |
| Deployment | Vercel |

---

## Architecture

### Hybrid rendering
Pages are server-rendered for SEO and authentication. If no valid session is found, the user is redirected to login server-side before any client code runs. Data fetching and mutations are handled client-side with TanStack Query.

### MongoDB embedded document pattern
Each active expense period lives as a single document per user. Expenses and pending payments are stored as embedded arrays within that document, a deliberate choice for a small-scale app that avoids the overhead of relational joins while keeping all period data co-located.

### Thin API routes
Business logic lives in pure server functions. API routes handle only HTTP concerns: authentication, input validation, DB connection, and response formatting. This keeps core logic independently testable without HTTP overhead.

### TanStack Query without optimistic updates
Mutations update the cache using `setQueryData` with the actual server response rather than optimistic updates. The server owns all financial calculations: totals, remaining balances, pending fulfillment, so the client never speculates on state.

### Security
API routes never trust client-sent table IDs. The active expenses table is always resolved server-side using `session.user.email + status: 'active'`, preventing users from accessing or modifying other users' data.

---

## Data Model

```typescript
// Active expenses table (one document per user per period)
{
  user_id: string,           // session email
  status: 'active' | 'closed',
  income: { cash: number, card: number },
  sDate: number,             // period start timestamp
  fDate: number,             // period end timestamp
  totals: {
    total_expenses: { cash: number, card: number },
    total_pending: { cash: number, card: number },
    total_payments_made: { cash: number, card: number }
  },
  pending: PendingExpenseI[],
  expenses: ExpenseItemI[],
  remaining: { cash: number, card: number }
}
```

---

## Testing

87 unit tests across 17 suites covering core business logic, input validation, and data mutations. Pure server functions are tested directly without HTTP layer overhead.

```bash
npm run test
```

---

## Running locally

### Prerequisites

- Node.js 22
- MongoDB 8.x running locally, or a MongoDB Atlas cluster

### Setup

```bash
git clone <repo-url>
cd <repo-folder>
npm ci
cp .env.example .env.local
```

### Environment variables

Edit `.env.local`. This file is git-ignored; never commit it.

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | Yes* | Local example: `mongodb://127.0.0.1:27017/expensesApp`. Use `127.0.0.1` rather than `localhost` to avoid IPv6 resolution issues. |
| `MONGODB_USER`, `MONGODB_PASS` | Alternative* | Only used when `MONGODB_URI` is empty. They build an Atlas connection string. Leave empty for a local database. |
| `NEXTAUTH_SECRET` | Yes | Any non-empty string works locally. In any real deployment, use a strong random value (`openssl rand -base64 32`). |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`, `HCAPTCHA_SECRET_KEY` | For sign-up | Use hCaptcha's official test keys for development (see their developer docs). |
| `NEXT_PUBLIC_DEMO_USER`, `NEXT_PUBLIC_DEMO_PASSWORD` | For demo login | Credentials used by the "Try demo" button. `NEXT_PUBLIC_` values are exposed to the browser, so use throwaway values. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional | Only needed for Google sign-in. The app runs without them, but the Google button won't work. |

\* Provide either `MONGODB_URI`, or both `MONGODB_USER` and `MONGODB_PASS`. With neither, the app refuses to connect.

`NEXTAUTH_URL` isn't needed for local development.

### Run

```bash
# If using a local MongoDB on Ubuntu/WSL
sudo systemctl start mongod

npm run dev
```

Open http://localhost:3000.

### Demo account

The "Try demo" button signs in as the user defined by `NEXT_PUBLIC_DEMO_USER` and `NEXT_PUBLIC_DEMO_PASSWORD`. That user must exist in your database, so sign up once with those exact credentials first. There is no seed data: create an expenses table and add a few expenses to see the dashboard and reports.
```

---

## Roadmap

- [x] Reports module — historical closed periods with filtering
- [ ] Accounts module
- [ ] Password reset flow
- [ ] GitHub OAuth

---

## Contibutions 🙏
- No Data Vectors by Vecteezy [Vecteezy](https://www.vecteezy.com/free-vector/no-data)

## License

- MIT
