module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    start: { type: DataTypes.DATE, allowNull: false },
    end: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.ENUM('scheduled','done','pending','cancelled'), allowNull: false, defaultValue: 'scheduled' }
  }, { tableName: 'Appointments', timestamps: true });

  return Appointment;
};