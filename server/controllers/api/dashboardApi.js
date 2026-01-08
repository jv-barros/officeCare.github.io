const db = require('../../models');
const { Op } = require('sequelize');

exports.weeklyChart = async (req, res) => {
  // return the last 7 days with sample counts
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0,0,0,0);
    const next = new Date(d);
    next.setHours(23,59,59,999);
    const consultations = await db.Appointment.count({ where: { start: { [Op.between]: [d, next] } } });
    data.push({ date: d.toISOString().slice(0,10), consultations });
  }
  res.json(data);
};

exports.calendarEvents = async (req, res) => {
  const events = (await db.Appointment.findAll()).map(a => ({ title: a.title, start: a.start, end: a.end }));
  res.json(events);
};