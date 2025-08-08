import { Sequelize } from "sequelize";

export const conn = new Sequelize("orm", "root", '123456789', {
  host: "localhost",
  dialect: "mysql",
  port: "3306"
});