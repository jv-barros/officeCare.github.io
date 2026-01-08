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
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();