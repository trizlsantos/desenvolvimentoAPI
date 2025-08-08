import { DataTypes } from "sequelize";
import { conn } from "./sequelize.js";
import tabelaResponsaveis from "./tabelaResponsaveis.js";

/** * payload esperado:
 * { id, nome, ra, email }
    */

   const alunosTabela = conn.define(
  "Alunos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    ra: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    responsavel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "alunos",
    timestamps: true,
    createdAt: "create_at",
    updatedAt: "updated_at",
  }
);
export default alunosTabela;