'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Appointments', {
      id: { type: Sequelize.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      start: { type: Sequelize.DATE, allowNull: false },
      end: { type: Sequelize.DATE, allowNull: true },
      status: { type: Sequelize.ENUM('scheduled','done','pending','cancelled'), allowNull: false, defaultValue: 'scheduled' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Appointments');
  }
};