import { DataTypes } from "sequelize";
import sequelize from "../db/dbConnection.js";


const GroupMember = sequelize.define("GroupMember", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    groupId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true, uniqueKeys: { unique_pair: { fields: ['groupId', 'userId'] } } });



export default GroupMember;