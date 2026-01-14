require('dotenv').config({ path: require('path').resolve(__dirname, '..', '..', '.env') });
const bcrypt = require('bcrypt');
const db = require('../models');

async function seed() {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existing = await db.User.findOne({ where: { email: adminEmail } });
    if (existing) {
      console.log('Admin user already exists:', adminEmail);
      process.exit(0);
    }

    const hash = await bcrypt.hash(adminPassword, 12);
    await db.User.create({ email: adminEmail, passwordHash: hash, role: 'admin' });
    console.log('Admin seeded:', adminEmail, 'password:', adminPassword);
    process.exit(0);
  } catch (err) {
    if (err && err.parent && err.parent.code === 'AUTH_SWITCH_PLUGIN_ERROR') {
      console.error('Seeding failed: DB requires an unsupported auth plugin (auth_gssapi_client).');
      console.error('If you are using the bundled Docker database, run `npm run fix-db-auth` to switch the dev user to password auth, then re-run `npm run seed`.');
      console.error('If you are on Windows without Docker, consider using WSL or configure your DB to use password authentication.');
    } else {
      console.error('Seeding failed:', err);
    }
    process.exit(1);
  }
}

seed();