import {Model, DataTypes} from "sequelize";
import { sequelize } from "../instances/mysql";
import { Aluno } from "./Aluno";
import { Disciplina } from "./Disciplina";


export class Nota extends Model{
    public id!: number;
    public alunoId!: number;
    public disciplinaId!: number;
    public nota!: number;
    public data_avaliacao!: Date;
}

Nota.init(
{
    
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },


    nota:{
        type: DataTypes.DECIMAL(5,2),
        allowNull: false,
    },

    data_avaliacao:{
        type: DataTypes.DATE,
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
    tableName: "notas",
    timestamps: true,
    paranoid:true,

}
);