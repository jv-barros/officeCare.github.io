# officeCare — local development notes

This repository contains the officeCare web app (frontend + Express/Sequelize backend).

## Quick start (dev)

1. Start Docker Desktop (Windows) and ensure the Docker Engine is running.
2. From project root:
   - docker-compose up -d db
3. From `server/`:
   - npm install
   - npm run seed (runs `seeders/seed-admin.js` to create an admin user)
   - npm start

## Known issue: MySQL GSSAPI / auth_gssapi_client

- Symptom: `npm run seed` fails with `Server requests authentication using unknown plugin auth_gssapi_client` or SSPI/SEC_E_INVALID_TOKEN.
- Cause: The MySQL server in the container is requesting Kerberos/GSSAPI authentication for connections. The Node client (`mysql2`) used by Sequelize does not perform GSSAPI in this environment.

### Workarounds / fixes

1. Recommended: Use a MySQL image without GSSAPI enabled (or use MariaDB).
   - Example: change `db.image` in `docker-compose.yml` to a stable tag like `mysql:8.0.33` or `mariadb:10.11` and `docker-compose pull && docker-compose up -d db`.
2. Create a DB user that uses a supported auth plugin (e.g., `caching_sha2_password`) and set `DB_USER`/`DB_PASSWORD` in `server/.env` accordingly.
3. Configure the MySQL server to remove or disable GSSAPI plugin (more advanced).
4. Temporary: I inserted an admin user directly into the DB so you can continue development without seeding.

### Useful commands I used

- Check running containers: `docker-compose ps` or `docker ps`
- Check auth plugins: `docker-compose exec db mysql -u root -prootpassword -e "SHOW PLUGINS;"`
- Create a user with caching_sha2: `docker-compose exec db mysql -u root -prootpassword -e "CREATE USER 'seeder'@'%' IDENTIFIED WITH caching_sha2_password BY 'seederPass'; GRANT ALL PRIVILEGES ON officecare_dev.* TO 'seeder'@'%'; FLUSH PRIVILEGES;"`

If you'd like, I can update `docker-compose.yml` to use an alternate MySQL/MariaDB image and test that the seeder runs successfully.
