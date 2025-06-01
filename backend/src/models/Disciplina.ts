import {Model, DataTypes} from "sequelize";
import { sequelize } from "../instances/mysql";
import { Professor } from "./Professor";

export class Disciplina extends Model{
    public id!: number;
    public nome!: string;
    public id_professor!: number;
}

Disciplina.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    id_professor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Professor,
            key: "id",
        },
        onDelete: "CASCADE",
    },
},
    
{
    sequelize,
    tableName: "disciplinas",
    paranoid:true,
    timestamps: true,
}
);