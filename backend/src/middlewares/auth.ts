import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "senha";


interface dataPayload extends JwtPayload {
    id:number;
    nome:string;
    tipo:string;
}


export const autenticarTokenProfessor = (req: Request, res: Response, next: NextFunction): void  => {
  
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        res.status(401).json({ error: "Token não fornecido" })
        return
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as dataPayload;
        
        if (!decoded.tipo) {
            res.status(403).json({ error: 'Token inválido - tipo de usuário não especificado' });
            return;
        }

        
        if (decoded.tipo !== "professor") {
            res.status(403).json({ error: "Acesso negado: apenas professores podem acessar" });
            return;
        }

        next();

    } catch (error) {
        res.status(403).json({ error: "Token inválido" })
        return;
    }
};


export const autenticarTokenGeral = (req: Request, res: Response, next: NextFunction): void  => {
  
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        res.status(401).json({ error: "Token não fornecido" })
        return;
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as dataPayload;
        
        if (!decoded.tipo) {
            res.status(403).json({ error: 'Token inválido - tipo de usuário não especificado' });
            return;
        } 

        next();

    } catch (error) {
        res.status(403).json({ error: "Token inválido" })
        return;
    }
};
