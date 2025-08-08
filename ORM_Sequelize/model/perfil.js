import { DataTypes } from "sequelize";
import { conn } from "../conn.js";
import Usuario from "./usuario.js";

const Perfil = conn.define(
  "perfis",
    {
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        //relacionamento
        usuario_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Usuario,
                key: 'id'
            }
        }

    },
    {}
);

// associação 1:1 -> Usuario tem Perfil e Perfil pertence a Usuari
Usuario.hasOne(Perfil, {foreingKey: 'usuario_id'});
Perfil.belongsTo(Usuario, {foreignKey: 'usuario_id'});

export default Perfil;