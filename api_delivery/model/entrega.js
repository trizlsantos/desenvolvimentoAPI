import {DataTypes} from "sequelize";
import {conn} from "../conn.js";
import Entregador from "./entrega.js"
import Pedidos from "./pedidos.js";

const Entrega = conn.define(
    "entrega",
    {
        descricao:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        pedido_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                  model: Pedidos,
                  key: 'id',
            },
        },
        entregador_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                  model: Entregador,
                  key: 'id',
            },
        }
    },
    {
        tableName: "entrega"
    }
)

//1:N
Pedidos.hasMany(Entrega, {foreignKey: 'pedido_id'})
Entrega.belongsTo(Pedidos, {foreignKey: 'pedido_id'})

Entregador.hasMany(Entrega, {foreignKey: 'entregador_id'})
Entrega.belongsTo(Entregador, {foreignKey: 'entregador_id'})

export default Entrega;