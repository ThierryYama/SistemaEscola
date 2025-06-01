import {Model, DataTypes} from "sequelize";
import { sequelize } from "../instances/mysql";
import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";


export class AlunoDisciplina extends Model{
    public id!: number;
    public alunoId!: number;
    public disciplinaId!: number;
}

AlunoDisciplina.init(
{
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    alunoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Aluno,
            key: "id",
        },
        onDelete: "CASCADE",
    },

    disciplinaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Disciplina,
            key: "id",
        },
        onDelete: "CASCADE",
    },
},
    
{
    sequelize,
    tableName: "aluno_disciplinas",
    timestamps: false,
}
);