import {DataTypes} from "sequelize";
import {conn} from "../conn.js";
import usuario from "./Usuario.js";
import restaurante from "./restaurante.js";

const pedidos = conn.define(
    "pedidos",
    {
        pedido:{
            type: DataTypes.STRING,
            allowNull:false 
        },
        usuario_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                  model: usuario,
                  key: 'id',
            },
          
        },
        restaurante_id:{
            type: DataTypes.INTEGER,
            allowNull: false, 
            references:{
                model: restaurante,
                key: "id",
            },
        },
    },
    {
        tableName: "pedidos"
    }
);
//1:N
usuario.hasMany(pedidos, {foreignKey: 'usuario_id'})
pedidos.belongsTo(usuario, {foreignKey: 'usuario_id'})

restaurante.hasMany(pedidos, {foreignKey: 'restaurante_id'})
pedidos.belongsTo(restaurante, {foreignKey: 'restaurante_id'})

export default pedidos; 