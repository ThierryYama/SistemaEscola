import {Model, DataTypes} from "sequelize";
import { sequelize } from "../instances/mysql";
import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";


export class Presenca extends Model{
    public id!: number;
    public alunoId!: number;
    public disciplinaId!: number;
    public data!: Date;
    public presente!: number;
}

Presenca.init(
{
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    data:{
        type: DataTypes.DATE,
        allowNull: false,
    },

    presente:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
    tableName: "presencas",
    timestamps: true,
    paranoid:true,

}
);