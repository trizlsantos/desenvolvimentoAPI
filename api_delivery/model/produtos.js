import {DataTypes} from "sequelize";
import {conn} from "../conn.js";
import restaurante from "./restaurante.js";

const produtos = conn.define(
    "produtos",
    {
        nome:{
            type: DataTypes.STRING,
            allowNull:false
        },
        restaurante_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: restaurante, 
                key: "id" 
            } 
        }
        
    },
    {
        tableName: "produtos"
    }
)

//Associacao 1:N 
restaurante.hasMany(produtos, {foreignKey: "restaurante_id"})
produtos.belongsTo(restaurante, {foreignKey: "restaurante_id"})
export default produtos;