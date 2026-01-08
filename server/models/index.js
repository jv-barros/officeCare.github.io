const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);

db.Appointment = require('./appointment')(sequelize, Sequelize.DataTypes);
db.Transaction = require('./transaction')(sequelize, Sequelize.DataTypes);

module.exports = db;