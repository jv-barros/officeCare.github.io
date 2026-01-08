module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
  }, {
    tableName: 'Users',
    timestamps: true,
  });

  User.prototype.safeJSON = function () {
    const { id, email, role, createdAt, updatedAt } = this;
    return { id, email, role, createdAt, updatedAt };
  };

  return User;
};