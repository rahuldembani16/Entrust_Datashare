# FarmShare

Farmer-first agricultural data sharing platform with multi-role access, regional benchmarking, and transparent data governance.

## Quick Start

```bash
npm run install:all
npm run seed
npm run dev
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:4000`

## Demo Logins

| Role | Email | Password |
|---|---|---|
| Farmer | farmer@demo.com | demo1234 |
| Researcher | researcher@demo.com | demo1234 |
| Service Provider | provider@demo.com | demo1234 |
| Govt | govt@demo.com | demo1234 |
| Admin | admin@demo.com | demo1234 |

## Project Structure

```text
backend/   Express, JWT auth, Knex, SQLite, seed data
frontend/  Vite React SPA, React Router, Recharts, React-Leaflet
```

## Notes

The backend stores data in `backend/farmshare.db`. Run `npm run seed` to recreate the demo database.
