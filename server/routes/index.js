const express = require('express');
const router = express.Router();
const ensureAuth = require('../utils/ensureAuth');
const db = require('../models');
const dashboardController = require('../controllers/dashboardController');

router.get('/', (req, res) => res.redirect('/dashboard'));

// Render dashboard (uses controller to aggregate KPIs)
router.get('/dashboard', ensureAuth, dashboardController.index);


module.exports = router;