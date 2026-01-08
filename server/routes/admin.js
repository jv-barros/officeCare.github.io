const express = require('express');
const router = express.Router();
const ensureAuth = require('../utils/ensureAuth');
const dashboardController = require('../controllers/dashboardController');
const adminController = require('../controllers/adminController');

// Dashboard
router.get('/dashboard', ensureAuth, dashboardController.index);

// Users (admin only)
router.get('/users', ensureAuth, async (req, res, next) => {
  if (req.session.role !== 'admin') return res.status(403).send('Forbidden');
  return adminController.listUsers(req, res, next);
});
router.get('/users/new', ensureAuth, (req, res, next) => {
  if (req.session.role !== 'admin') return res.status(403).send('Forbidden');
  return adminController.newUserForm(req, res, next);
});
router.post('/users', ensureAuth, async (req, res, next) => {
  if (req.session.role !== 'admin') return res.status(403).send('Forbidden');
  return adminController.createUser(req, res, next);
});

module.exports = router;