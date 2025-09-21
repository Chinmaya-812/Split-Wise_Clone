import { DataTypes } from "sequelize";
import sequelize from "../db/dbConnection.js";

const Expense = sequelize.define("Expense", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { timestamps: true });

Expense.associate = models => {
    Expense.belongsTo(models.User, { foreignKey: "paidBy" });
    Expense.belongsTo(models.Group, { foreignKey: "groupId" });
    Expense.hasMany(models.ExpenseParticipant);
};

export default Expense;