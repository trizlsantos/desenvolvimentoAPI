import usuarios from "./usuarios.js";
import {conn} from "../conn.js";
import {DataTypes} from "sequelize";


const restaurante = conn.define(
    "restaurante", 
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usuario_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: usuarios, 
                key: "id" 
            } 
        }
        
    },
    {
        tableName:"restaurante"
    }
)

//Associacao 1:N 
usuarios.hasMany(restaurante, {foreignKey: "usuario_id"})
restaurante.belongsTo(usuarios, {foreignKey: "usuario_id"})

export default restaurante;