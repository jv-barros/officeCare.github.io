module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    description: { type: DataTypes.STRING(255) }
  }, { tableName: 'Transactions', timestamps: true });

  return Transaction;
};