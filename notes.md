- control 
    - deployment of the home (landing page) - 
        - refactor index-2.html - 
            - change names for officecare and add products - 
                - maintain minimalist design - 
            - translate 
                - using html attribute "translate" - 
                    - test again - pendent 
    - deploy - 
    - other pages - 
        - home layout ana - doing  
            - definindo arquitetura - mvc - ok 
            - readme - 
            - iniciando alterações - 
            - 
        - logo branca - alterar, fazer no mac por conta do bloqueio da rede no trabalho 
        - 



        - dentro da tela de automacoes posso criar um server como era na insightcare - 
        - 

## Next steps (DB seeding & Docker) ✅

- Current status:
  - The MySQL container is running but the server is requesting GSSAPI (Kerberos) auth (`auth_gssapi_client`) which the Node.js `mysql2` client does not support in this environment.
  - I inserted an admin user directly into the DB so you can log in and continue working:
    - Admin email: `jvcbcarvalho@gmail.com`
    - Password: `Officecare@2025` (bcrypt-hashed in DB)
  - I attempted several fixes (adding an auth plugin fallback, creating a `seeder` user), but the connection still fails during the GSSAPI handshake (SSPI error) when running `npm run seed`.

- Recommended next actions (pick one):
  1. Replace the MySQL image with a stable non-GSSAPI build (recommended for local dev):
     - Example change in `docker-compose.yml`: set `image: mysql:8.0.33` or use `mariadb:10.11` to avoid GSSAPI complexity.
     - Then: `docker-compose pull && docker-compose up -d db` and re-run `cd server && npm run seed`.
  2. Configure the MySQL server to disable or not load the GSSAPI plugin (advanced): add appropriate `my.cnf` config or remove plugin load entries; rebuild container.
  3. Keep the current DB and skip running the seeder: you already have an admin user inserted manually (safest short-term).

- Quick commands I ran (use as reference):
  - Check plugins: `docker-compose exec db mysql -u root -prootpassword -e "SELECT PLUGIN_NAME,PLUGIN_STATUS FROM information_schema.plugins WHERE PLUGIN_NAME LIKE '%sha%';"`
  - Create seeder user: `docker-compose exec db mysql -u root -prootpassword -e "CREATE USER 'seeder'@'%' IDENTIFIED WITH caching_sha2_password BY 'seederPass'; GRANT ALL PRIVILEGES ON officecare_dev.* TO 'seeder'@'%'; FLUSH PRIVILEGES;"`
  - Manual seed (insert admin): executed SQL to create `Users` table and inserted admin user directly.

- If you want me to proceed:
  - Say **"Switch MySQL image"** and I will update `docker-compose.yml` to a suggested image and test the seeder.
  - Say **"Disable GSSAPI"** and I will inspect container configs and propose changes (may require rebuilding image).
  - Or say **"Stop here"** and I will just keep these notes updated and help with non-DB tasks.

