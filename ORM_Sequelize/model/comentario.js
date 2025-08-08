import { DataTypes } from "sequelize";
import { conn } from "../conn.js";
import Usuario from "./usuario.js";
import Publicacao from "./publicacao.js";

const comentario = conn.define(
    "comentarios",
    {
        comentario: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Usuario,
                key: "id",
            },
    },
    publicacao_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
            references: {
                model: Publicacao,
                key: "id",
            },
        },
    },
    {
        tableName: "comentarios"
}
);

Usuario.hasMany(comentario, { foreignKey: 'usuario_id' });
comentario.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Publicacao.hasMany(comentario, { foreignKey: 'publicacao_id' });
comentario.belongsTo(Publicacao, { foreignKey: 'publicacao_id' });

export default comentario;