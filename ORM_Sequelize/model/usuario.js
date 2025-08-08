import { DataTypes } from "sequelize";
import { conn } from "../conn.js";

const Usuario = conn.define(
  "usuarios",
  {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, 
  {
    tableName: "usuarios"
  }
);

export default Usuario;