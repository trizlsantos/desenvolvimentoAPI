import { DataTypes } from "sequelize";
import { conn } from "../conn.js";
import Usuario from "./usuario.js";

const Publicacao = conn.define(
    "publicacao",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },

    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    },

    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios', // Nome da tabela referenciada
            key: 'id' // Chave primária da tabela referenciada
    }
}
    },
    {
        tableName: "publicacao"
    }
)


// Associação 1:N
// Usuario tem varias publicacoes
Usuario.hasMany(Publicacao, { foreignKey: 'usuario_id' })
// Publicacao pertence a um Usuario
Publicacao.belongsTo(Usuario, { foreignKey: 'usuario_id' });

export default Publicacao;