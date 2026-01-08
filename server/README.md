# OfficeCare - Server

This folder contains a minimal Express + Sequelize server for OfficeCare with session-based auth.

Quick start (dev):

1. Copy `.env.example` to `.env` and update values.
2. Start a local MySQL (Docker Compose provided):

   From the project root (where `docker-compose.yml` is located), run:

   ```bash
   docker compose up -d
   ```

   If your environment uses the legacy standalone binary, you can run:

   ```bash
   docker-compose up -d
   ```

   Or, if you're already inside the `server/` folder, run:

   ```bash
   docker compose -f ../docker-compose.yml up -d
   ```

   Note: Docker Desktop (or Docker Engine with the Compose plugin) must be installed and running. If `docker compose` is not available on your machine, install Docker Desktop: https://www.docker.com/get-started

3. From `server/` install dependencies:

   cd server
   npm install

4. Seed an admin user (email and password are in `.env`):

   npm run seed

5. (Optional) Seed demo dashboard data (appointments, transactions):

   npm run seed:demo

6. Start the server:

   npm run dev

7. Open http://localhost:3000/login and sign in with the seeded admin credentials. Once signed in as admin, visit http://localhost:3000/admin/users to manage users and http://localhost:3000/dashboard to see the dashboard.

Notes:
- Only admin-created users are supported by default (no public registration form).
- Static assets from the main project (css/, js/, images/) are served at `/static`.
- The session store uses MySQL (express-mysql-session). Set `SESSION_SECRET` in `.env`.

Security TODOs:
- Enable secure cookies in production (HTTPS)
- Harden CSP/headers if needed
- Add tests and a QA checklist
