const db = require('../models');
const bcrypt = require('bcrypt');

exports.listUsers = async (req, res) => {
  const users = await db.User.findAll({ order: [['createdAt','DESC']] });
  res.render('admin/users', { users });
};

exports.newUserForm = (req, res) => {
  res.render('admin/create-user', { errors: [], old: {} });
};

exports.createUser = async (req, res) => {
  const { email, password, role } = req.body;
  const errors = [];
  if (!email) errors.push('Email required');
  if (!password || password.length < 6) errors.push('Password min 6 chars');
  if (errors.length) return res.render('admin/create-user', { errors, old: req.body });

  const existing = await db.User.findOne({ where: { email } });
  if (existing) {
    return res.render('admin/create-user', { errors: ['User already exists'], old: req.body });
  }

  const hash = await bcrypt.hash(password, 12);
  await db.User.create({ email, passwordHash: hash, role: role || 'user' });
  res.redirect('/admin/users');
};