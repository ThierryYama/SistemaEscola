import {Model, DataTypes} from "sequelize";
import { sequelize } from "../instances/mysql";
import { Turma } from "./Turma";

export class Aluno extends Model{
    public id!: number;
    public nome!: string;
    public email!: string;
    public senha!: string;
    public matricula!: string;
    public id_turma!: number;
}

Aluno.init(
{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    senha: {
        type: DataTypes.STRING(256),
        allowNull: true,
    },

    matricula: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    id_turma: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Turma,
            key: "id",
        },
        onDelete: "CASCADE",
    },
},
    
{
    sequelize,
    tableName: "alunos",
    paranoid:true,
    timestamps: true,
}
);