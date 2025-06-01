import {Model, DataTypes} from "sequelize";
import { sequelize } from "../instances/mysql";


export class Professor extends Model{
    public id!: number;
    public nome!: string;
    public email!: string;
    public siape!: string;
    public senha!: string;
}

Professor.init(
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
        unique: true,
    },
    senha: {
        type: DataTypes.STRING(256),
        allowNull: true,
    },
    
    siape: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
    
{
    sequelize,
    tableName: "professores",
    paranoid:true,
    timestamps: true,
}
);