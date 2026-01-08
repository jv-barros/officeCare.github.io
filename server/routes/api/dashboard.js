const express = require('express');
const router = express.Router();
const api = require('../../controllers/api/dashboardApi');

router.get('/chart/weekly', api.weeklyChart);
router.get('/calendar-events', api.calendarEvents);

module.exports = router;