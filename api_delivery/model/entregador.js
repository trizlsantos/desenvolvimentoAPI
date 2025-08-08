
import {DataTypes} from "sequelize";
import {conn} from "../conn.js";
import usuario from "./Usuario.js";

const Entregador = conn.define(
    "entregador",
    {
        nome:{
            type: DataTypes.STRING,
            allowNull: false
        },
        usuario_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                  model: usuario,
                  key: 'id',
            },
        }
    },
    {
        tableName: "entregador"
    }
)

usuario.hasOne(Entregador, {foreignKey: 'usuario_id'})
Entregador.belongsTo(usuario, {foreignKey:'usuario_id'}) 

export default Entregador ;