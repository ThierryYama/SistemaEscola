import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize (

    process.env.MYSQL_DB as string,
    process.env.MYSQL_USER as string,
    process.env.MYSQL_PASSWORD as string,
    {
        dialect: 'mysql',
        port: parseInt(process.env.MYSQL_PORT as string),
        host: process.env.MYSQL_HOST

    }
);


export const conectarBanco = async () =>{

    try{
        await sequelize.authenticate();
        console.log("Banco conectado com sucesso!");
    } catch(error){
        console.error("Erro ao conectar no Banco: ", error);
    }
};