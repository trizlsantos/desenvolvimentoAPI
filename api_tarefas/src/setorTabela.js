import { DataTypes } from "sequelize";
import { conn } from "./sequelize.js";

const tabelaSetor = conn.define(
    'setores',
    {
        nome: {
            type: DataTypes.STRING,
            allowNull: false  
        }
    },
    {
        timestamps: true,
        tableName: 'setores',
        createdAt: 'updated_at',
        updatedAt: 'created_at'
    }
)

export default tabelaSetor; 