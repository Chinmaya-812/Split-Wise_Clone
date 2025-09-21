import { DataTypes } from "sequelize";
import sequelize from "../db/dbConnection.js";

const Group = sequelize.define("Group", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    created_by: {
        type: DataTypes.STRING, allowNull: false,
    }
}, { timestamps: true });

Group.associate = models => {
    Group.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator"
    });

    Group.belongsToMany(models.User, {
        through: models.GroupMember,
        foreignKey: "groupId",
        otherKey: "userId"
    });

    Group.hasMany(models.Expense, {
        foreignKey: "groupId",
        as: "expenses"
    });
};

export default Group;