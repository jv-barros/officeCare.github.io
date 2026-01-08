const path = require('path');
const express = require('express');
const session = require('express-session');
const createSessionOptions = require('./config/session');
const helmet = require('helmet');
const csrf = require('csurf');
const db = require('./models');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();

app.use(helmet());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve project static files (css/, js/, images/ from project root)
app.use('/static', express.static(path.join(__dirname, '..')));

// Sessions
app.use(session(createSessionOptions(session)));

// CSRF protection (for forms)
app.use(csrf());

// Make csrf token available in views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  res.locals.currentUser = req.session && req.session.userId ? { id: req.session.userId, role: req.session.role } : null;
  next();
});

// Routes
app.use(require('./routes/auth'));
app.use(require('./routes/index'));

// Admin and API routes
app.use('/admin', require('./routes/admin'));
app.use('/api/dashboard', require('./routes/api/dashboard'));

// 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start server
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
