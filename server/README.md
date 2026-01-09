# officeCare — local development notes

This repository contains the officeCare web app (frontend + Express/Sequelize backend).

## Quick start (dev)

### Option A: Frontend only (no backend)
Perfect for HTML, CSS, and JavaScript development without needing a running database or Node.js backend server.

#### Method 1: Using http-server (Node.js) — Recommended
**Prerequisites:** Node.js and npm installed on your Windows machine.

**Setup:**
1. Open PowerShell and navigate to the project root:
   ```powershell
   cd C:\Users\joao.vitor\Desktop\officeCare-new
   ```
2. Install http-server globally (first time only):
   ```powershell
   npm install -g http-server
   ```
3. Start the frontend server:
   ```powershell
   http-server . -p 8000
   ```
   Or from the server folder with the npm script:
   ```powershell
   cd server
   npm run serve:frontend
   ```
4. Open [http://localhost:8000](http://localhost:8000) in your browser.
5. To stop the server, press **Ctrl+C** in the terminal.

**Expected output:**
```
Starting up http-server, serving . 
Hit CTRL-C to stop the server
http://127.0.0.1:8000
```

---

#### Method 2: Using Python's built-in server
**Prerequisites:** Python 3 installed on your Windows machine.

**Setup:**
1. Open PowerShell and navigate to the project root:
   ```powershell
   cd C:\Users\joao.vitor\Desktop\officeCare-new
   ```
2. Start the Python HTTP server:
   ```powershell
   python -m http.server 8000
   ```
3. Open [http://localhost:8000](http://localhost:8000) in your browser.
4. To stop the server, press **Ctrl+C** in the terminal.

**Expected output:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

---

#### Frontend-only Troubleshooting

##### "Port 8000 already in use"
**Solution:** Use a different port:
```powershell
http-server . -p 8001
# or
python -m http.server 8001
```
Then access [http://localhost:8001](http://localhost:8001) in your browser.

**Find and kill the process using port 8000 (Windows):**
```powershell
netstat -ano | findstr :8000
# Note the PID in the last column, then:
taskkill /PID [PID] /F
```

##### "http-server command not found"
**Solution:** Install it globally:
```powershell
npm install -g http-server
```

##### "Python command not found"
**Solution:** Ensure Python 3 is installed and added to PATH:
1. Download Python from [python.org](https://www.python.org/downloads/)
2. During installation, check **Add Python to PATH**
3. Restart PowerShell and verify:
   ```powershell
   python --version
   ```

##### "Cannot open index.html directly"
**Issue:** Opening the file directly (`file:///C:/...`) prevents CSS/JS from loading (CORS).
**Solution:** Always use the HTTP server (port 8000 or 8001), not `file://`.

---

#### Frontend-only Quick Reference

| Task | Command |
|------|---------|
| Start http-server (port 8000) | `http-server . -p 8000` |
| Start http-server (custom port) | `http-server . -p 8001` |
| Start Python server (port 8000) | `python -m http.server 8000` |
| Stop server | **Ctrl+C** in terminal |
| Open frontend | [http://localhost:8000](http://localhost:8000) |
| Check if port is in use | `netstat -ano \| findstr :8000` |
| Kill process on port 8000 | `taskkill /PID [PID] /F` |
| View available files | Open http://localhost:8000 in browser → directory listing |

---

**When to use Frontend-only:**
- ✅ Rapid CSS/HTML/JavaScript editing and testing
- ✅ No database or authentication needed
- ✅ Quick visual changes (colors, layouts, responsive design)
- ❌ Cannot test login, user dashboard, or API integration
- ❌ Backend endpoints return 404 or fail silently

**Limitations:**
- No backend API (routes return 404)
- No database access (login won't work)
- No session management
- Static assets only (HTML, CSS, JS, images)

### Option B: Full stack (frontend + backend) — Recommended solution: WSL 2
The Node.js backend has a known GSSAPI/SSPI authentication issue on Windows (see [Known issue](#known-issue-mysql-gssapi--auth_gssapi_client) below). **The recommended workaround is to run the backend in WSL 2 (Windows Subsystem for Linux)**, where this issue does not occur.

#### Setup with WSL 2 (recommended)

##### Step 1: Install WSL 2
1. Open PowerShell **as Administrator** and run:
   ```powershell
   wsl --install -d Ubuntu
   ```
2. Restart your machine when prompted.
3. After restart, open Ubuntu from the Start menu or type `wsl` in PowerShell.
4. Create a username and password for your WSL user (you'll use this to run commands).

**Verify WSL 2 is installed:**
```powershell
wsl --version
```
Should show WSL version 2.x or higher. If it shows version 1, upgrade:
```powershell
wsl --set-default-version 2
```

##### Step 2: Set up Docker Desktop for WSL 2
1. Ensure Docker Desktop is running on Windows.
2. Open Docker Desktop Settings:
   - **Resources** → **WSL Integration**
   - Enable "Ubuntu" (or your distro).
   - Click **Apply & Restart**.
3. Verify Docker works in WSL:
   ```bash
   wsl
   docker --version
   docker-compose --version
   ```
   Both should show version info (e.g., `Docker version 25.x`, `Docker Compose version 2.x`).

##### Step 3: Access your project in WSL 2
1. Open WSL Ubuntu:
   ```powershell
   wsl
   ```
2. Navigate to your project (mounted from Windows):
   ```bash
   cd /mnt/c/Users/joao.vitor/Desktop/officeCare-new
   # OR (shorter)
   cd /mnt/c/Users/$(whoami)/Desktop/officeCare-new
   ```
   (Replace `joao.vitor` with your Windows username if different.)
3. Verify you're in the right place:
   ```bash
   ls -la
   # Should see: docker-compose.yml, index.html, server/, css/, js/, etc.
   ```

##### Step 4: Install Node.js & npm in WSL 2
1. Update package manager:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
2. Install Node.js (LTS version):
   ```bash
   sudo apt install -y nodejs npm
   ```
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

##### Step 5: Start the database in WSL 2
From your project root in WSL:
```bash
docker-compose up -d db
```
Verify the container is running:
```bash
docker-compose ps
# Should show: officecare-new-db-1 ... Up ...
```

##### Step 6: Install server dependencies & start the backend
```bash
cd server
npm install
npm start
```
Expected output:
```
Database connected
Server running on http://localhost:3000
```

##### Step 7 (Optional): Serve the frontend
In a new WSL terminal (while `npm start` is running in the first):
```bash
cd /mnt/c/Users/joao.vitor/Desktop/officeCare-new
npx http-server . -p 8000
```
Expected output:
```
Hit CTRL-C to stop the server
http://127.0.0.1:8000
http://192.168.x.x:8000
```

##### Step 8: Access the app from Windows
- **Backend API**: [http://localhost:3000](http://localhost:3000) (from Windows browser)
- **Frontend**: [http://localhost:8000](http://localhost:8000) (from Windows browser)
  - Login with: **Email**: `jvcbcarvalho@gmail.com`, **Password**: `Officecare@2025`

---

#### WSL 2 Troubleshooting

##### "Docker is not available in WSL 2"
**Solution:**
1. Ensure Docker Desktop is running on Windows.
2. Re-enable WSL integration in Docker Desktop:
   - Settings → **Resources** → **WSL Integration** → Enable Ubuntu → **Apply & Restart**.
3. Restart WSL terminal:
   ```powershell
   wsl --shutdown
   wsl
   ```

##### "npm command not found" in WSL 2
**Solution:**
1. Reinstall Node.js:
   ```bash
   sudo apt remove nodejs npm
   sudo apt update
   sudo apt install -y nodejs npm
   ```
2. Verify:
   ```bash
   which npm
   npm --version
   ```

##### "Cannot access files from Windows in WSL 2"
**Solution:**
- Use the correct mount path: `/mnt/c/Users/YOUR_USERNAME/...` (not `C:\...`)
- Verify with:
  ```bash
  ls -la /mnt/c/Users/
  ```

##### "Port 3000 or 8000 already in use"
**Solution:**
1. Find the process using the port:
   ```bash
   sudo lsof -i :3000
   # or
   sudo netstat -tlnp | grep 3000
   ```
2. Kill the process (replace `PID` with the number shown):
   ```bash
   sudo kill -9 PID
   ```
3. Or use a different port:
   ```bash
   npm start -- --port 3001
   ```

##### "Database connection fails from WSL 2"
**Solution:**
1. Verify Docker container is running from Windows (not WSL):
   ```powershell
   docker ps
   ```
   Should show `officecare-new-db-1` running.
2. Test connection from WSL:
   ```bash
   docker-compose exec db mariadb -u root -prootpassword -e "SELECT 1;"
   # Should output: 1
   ```
3. Check environment variables:
   ```bash
   cat server/.env | grep DB_
   ```
   Ensure `DB_HOST=127.0.0.1` (not a Windows IP).

---

#### WSL 2 Quick Reference

| Task | Command |
|------|---------|
| Open WSL 2 | `wsl` (PowerShell) or "Ubuntu" (Start menu) |
| Exit WSL 2 | `exit` |
| Access Windows files | `cd /mnt/c/Users/YOUR_USERNAME/Desktop/officeCare-new` |
| Check WSL version | `wsl --version` (PowerShell) or `wsl -v` |
| List WSL distros | `wsl --list --verbose` (PowerShell) |
| Stop all WSL | `wsl --shutdown` (PowerShell) |
| Stop specific distro | `wsl --terminate Ubuntu` (PowerShell) |
| View Docker in WSL | `docker ps` |
| View Docker Compose | `docker-compose ps` |
| Rebuild database | `docker-compose down -v && docker-compose up -d db` |
| View database logs | `docker-compose logs db -f` |
| Connect to database CLI | `docker-compose exec db mariadb -u root -prootpassword` |

---

**Why WSL 2 works**: Linux does not use Windows SSPI/Kerberos authentication, so the Node.js `mysql2` client can connect to the database using standard password authentication without the GSSAPI error.

### Option C: Windows (with Docker) — database only
If you want to keep the database running on Windows Docker and manually manage the backend:
1. Start Docker Desktop.
2. From project root:
   - `docker-compose up -d db`
3. Open [index.html](index.html) directly in your browser to view the frontend.
4. The Users table and admin account are pre-created, so you can log in if you implement the login backend separately.

---

## Known issue: MySQL GSSAPI / auth_gssapi_client

### Symptom
Running `npm start` or `npm run seed` fails with one of these errors:
- `Server requests authentication using unknown plugin auth_gssapi_client`
- `SSPI server error 0x80090308 - AcceptSecurityContext - SEC_E_INVALID_TOKEN`

### Root cause
On Windows, the Node.js `mysql2` client attempts to use Windows SSPI/Kerberos authentication at the TCP level. The Docker MySQL/MariaDB containers have GSSAPI support enabled, so they offer it as an authentication method. However, `mysql2` does not implement the GSSAPI protocol, so the authentication handshake fails.

This is a **Windows-specific issue** caused by the OS-level SSPI integration with TCP connections. It does not occur on Linux or macOS.

### Solutions (in order of recommendation)

#### 1. **WSL 2 (Recommended)**
Run the Node.js backend inside WSL 2 Ubuntu. Linux does not use SSPI, so standard password authentication works without issues.
- See [Setup with WSL 2](#setup-with-wsl-2-recommended) above for detailed steps.
- **Pros**: Simple, native Node.js performance in Linux, clean separation of concerns.
- **Cons**: Requires WSL 2 setup (one-time).

#### 2. **Docker Container for Node.js (Alternative)**
Run the Node.js app inside a Docker container instead of on Windows directly. Docker containers (even on Windows) isolate the network stack from Windows SSPI.
- Create a `Dockerfile` in the `server/` folder with Node.js.
- Update `docker-compose.yml` to include the app service and link it to the db service.
- Run: `docker-compose up -d` to start both db and app.
- **Pros**: Full containerization, consistent environment.
- **Cons**: Slightly more setup.

#### 3. **Disable GSSAPI in the database server (Advanced)**
Modify the MySQL/MariaDB server configuration to not offer GSSAPI as an authentication method. This requires:
- Creating a custom Dockerfile for MySQL/MariaDB.
- Adding configuration to disable or unload the GSSAPI plugin.
- Rebuilding the container image.
- **Pros**: Works on Windows native Node.js.
- **Cons**: Complex, requires container image customization, may break other setups.

#### 4. **Use a different database (PostgreSQL)**
Migrate from MySQL/MariaDB to PostgreSQL, which does not have the same GSSAPI complexity on Windows.
- Update Sequelize config and models to use `dialect: 'postgres'`.
- Use `postgres` Docker image instead of `mysql`.
- **Pros**: PostgreSQL is excellent for Node.js apps, often simpler configuration.
- **Cons**: Requires model and migration changes.

### Workaround (temporary)
- The database and admin user are pre-created in the Docker container.
- You can log in with: **Email**: `jvcbcarvalho@gmail.com`, **Password**: `Officecare@2025`
- Serve the frontend statically (Option A above) and implement backend authentication separately if needed.

### Debugging
If you want to investigate further:
1. Check the MariaDB user plugin:
   - `docker-compose exec db mariadb -u root -prootpassword -e "SELECT User,Host,plugin FROM mysql.user WHERE User='officecare';"`
2. Check MariaDB version:
   - `docker-compose exec db mariadb -u root -prootpassword -e "SELECT VERSION();"`
3. Attempt to connect from WSL 2 to confirm it works there:
   - `wsl mysql -h 127.0.0.1 -u officecare -p officecare officecare_dev`

---

## Project structure

- **Frontend**: `index.html`, `css/`, `js/`, `images/`, `plugins/` — static assets and HTML.
- **Backend**: `server/` — Express.js app with Sequelize ORM.
  - `app.js` — main server file.
  - `config/` — database and session configuration.
  - `models/` — Sequelize models (User, Appointment, Transaction).
  - `routes/` — API routes (auth, dashboard, admin).
  - `controllers/` — business logic.
  - `seeders/` — database initialization scripts.
- **Database**: Defined in `docker-compose.yml` (MariaDB 11).

---

## Environment variables

Create or update `.env` in the `server/` folder:

```env
# Server
PORT=3000
SESSION_SECRET=<your-secure-random-string>

# MySQL / MariaDB
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=officecare_dev
DB_USER=officecare
DB_PASSWORD=officecare

# Admin credentials for seeding
ADMIN_EMAIL=jvcbcarvalho@gmail.com
ADMIN_PASSWORD=Officecare@2025
```

---

## Commands

```bash
# Start Docker database
docker-compose up -d db

# Seed admin user (may fail on Windows due to GSSAPI issue — use WSL 2 instead)
cd server && npm run seed

# Start Node.js server
npm start

# Serve frontend statically
npx http-server . -p 8000

# View database logs
docker-compose logs db

# Stop and remove containers
docker-compose down
```

---

## Contact & support

For issues related to the GSSAPI/SSPI authentication error, use **WSL 2** (recommended) or consult the [Solutions](#solutions-in-order-of-recommendation) section above.

