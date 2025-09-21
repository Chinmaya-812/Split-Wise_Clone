import { DataTypes } from "sequelize";
import sequelize from "../db/dbConnection.js";

const ExpenseParticipant = sequelize.define("ExpenseParticipant", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    expenseId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    amountOwed: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
    timestamps: false,
    uniqueKeys: {
        unique_pair: {
            fields: ['expenseId', 'userId']
        }
    }
});


export default ExpenseParticipant;