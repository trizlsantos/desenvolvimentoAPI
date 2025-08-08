import { DataTypes } from "sequelize";
import { conn } from "./sequelize.js";
import tabelaSetor from "./setorTabela.js";

/**
 * payload esperado:
 * { id, tarefa, descricao, situacao, setorId, created_at, updated_at }
 */

const tabelaTarefa = conn.define(
  "Tarefa",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tarefa: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    descricao: {
      type: DataTypes.STRING,
    },
    situacao: {
      type: DataTypes.ENUM("pendente", "concluido"),
      defaultValue: "pendente",
      allowNull: false,
    },
    setorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: tabelaSetor,
        key: "id",
      },
    },
  },
  {
    tableName: "tarefas",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);


tabelaSetor.hasMany(tabelaTarefa, {
  foreignKey: "setorId",
  as: "tarefas",
});

tabelaTarefa.belongsTo(tabelaSetor, {
  foreignKey: "setorId",
  as: "setor", 
});

export default tabelaTarefa;