import {DataTypes} from "sequelize";
import {conn} from "../conn.js";
import Pedidos from "./pedidos.js";

const Avaliacao = conn.define(
    "avaliacoes",
    {
        descricao:{
            type: DataTypes.STRING,
            allowNull: false
        },
        pedido_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                  model: Pedidos,
                  key: 'id',
            },
        }
    },
    {
        tableName: "avaliacoes"
    }
)

edidos.hasOne(Avaliacao, {foreignKey: 'pedido_id'})
Avaliacao.belongsTo(Pedidos, {foreignKey:'pedido_id'}) 

export default Avaliacao ;