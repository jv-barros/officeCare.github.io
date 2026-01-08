const MySQLStore = require('express-mysql-session')(require('express-session'));
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '..', '.env') });

const sessionOptions = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'officecare',
  password: process.env.DB_PASSWORD || 'officecare',
  database: process.env.DB_NAME || 'officecare_dev',
};

module.exports = function (session) {
  const store = new MySQLStore(sessionOptions);

  return {
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // set secure: true in production (with HTTPS)
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    store,
  };
};