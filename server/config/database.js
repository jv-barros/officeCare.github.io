const { Sequelize } = require('sequelize');
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '..', '.env') });

const sequelize = new Sequelize(process.env.DB_NAME || 'officecare_dev', process.env.DB_USER || 'officecare', process.env.DB_PASSWORD || 'officecare', {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;