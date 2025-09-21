import { DataTypes } from "sequelize";
import sequelize from "../db/dbConnection.js";

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});


User.associate = models => {
  User.hasMany(models.Expense, { foreignKey: "paidBy" });
  User.belongsToMany(models.Group, { through: models.GroupMember });
}

export default User;