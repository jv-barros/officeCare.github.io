const db = require('../models');
const { Op } = require('sequelize');

exports.index = async (req, res) => {
  // Simple metric queries
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);
  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  const patientsToday = await db.Appointment.count({ where: { start: { [Op.between]: [todayStart, todayEnd] } } });
  const appointmentsToday = patientsToday;
  const pending = await db.Appointment.count({ where: { status: 'pending' } });
  const revenue = await db.Transaction.sum('amount', { where: { date: { [Op.between]: [todayStart, todayEnd] } } }) || 0;

  const recentAppointments = await db.Appointment.findAll({ limit: 5, order: [['start','DESC']] });
  const recent = recentAppointments.map(a => `${a.title} - ${a.start.toLocaleString()}`);

  res.render('dashboard', {
    kpis: { patientsToday, appointmentsToday, pending, revenue },
    recent,
    user: res.locals.currentUser
  });
};