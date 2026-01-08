const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const db = require('../models');

exports.getLogin = (req, res) => {
  res.render('auth/login', { csrfToken: req.csrfToken(), errors: [], old: {} });
};

exports.postLogin = [
  body('email').isEmail().withMessage('Provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/login', { csrfToken: req.csrfToken(), errors: errors.array(), old: req.body });
    }

    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).render('auth/login', { csrfToken: req.csrfToken(), errors: [{ msg: 'Invalid credentials' }], old: req.body });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).render('auth/login', { csrfToken: req.csrfToken(), errors: [{ msg: 'Invalid credentials' }], old: req.body });
    }

    // successful login
    req.session.userId = user.id;
    req.session.role = user.role;
    res.redirect('/dashboard');
  }
];

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};