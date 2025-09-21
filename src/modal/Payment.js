import { DataTypes } from "sequelize";
import sequelize from "../db/dbConnection.js";

const Payment = sequelize.define("Payment", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    paidBy: { type: DataTypes.INTEGER, allowNull: false },
    paidTo: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    note: { type: DataTypes.TEXT }
}, { timestamps: true });

Payment.associate = models => {
    Payment.belongsTo(models.User, { as: "payer", foreignKey: "paidBy" });
    Payment.belongsTo(models.User, { as: "receiver", foreignKey: "paidTo" });
};


export default Payment