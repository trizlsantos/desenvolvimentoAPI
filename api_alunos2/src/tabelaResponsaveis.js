import { DataTypes } from "sequelize";
import { conn } from "./sequelize.js";
import alunosTabela from "./alunosTabela.js";

/**
 * payload esperado:
 * { nome, idade, email, senha, telefone, grau de parentesco, endereco, dt_nascimento}
 */

const tabelaResponsaveis = conn.define(
  "Responsaveis",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    idade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grau_parentesco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dt_nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "responsaveis",
    timestamps: true,
  }
);


export default tabelaResponsaveis;