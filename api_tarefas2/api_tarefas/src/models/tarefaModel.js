import { DataTypes } from "sequelize";
import { conn } from "../sequelize.js";
import setorModel from "./setorModel.js";
/** payload
 * {id, tarefa, descricao, situacao, created_at, updated_at}
 */
const tarefaModel = conn.define(
  "Tarefa",
  {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    tarefa: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    descricao: {
        type: DataTypes.STRING
    },
    situacao: {
        type: DataTypes.ENUM('pendente', 'concluido'),
        defaultValue: 'pendente',
        allowNull: false
    },
    setor_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: tabelaSetor,
        key: 'id'
      }
    }
  },
  {
    tableName: 'tarefas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

setorModel.hasMany(tarefaModel,{foreignKey: 'setor_id'})
tarefaModel.belongsTo(setorModel,{foreignKey: 'setor_id'})

export default tarefaModel;