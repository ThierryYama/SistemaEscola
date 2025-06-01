import { Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import { Aluno } from "../models/Aluno";
import { Professor } from "../models/Professor";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "senha";

interface Payload {
  id: number;
  nome: string;
  tipo: string;
}

export const gerarToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const payload = {
    id: 1,
    nome: "thierry",
    tipo: "aluno",
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

  res.json({ token });
};

export const fazerLogin = async (req: Request, res: Response): Promise<any> => {
  const { matricula, senha } = req.body;
  if (matricula) {
    console.log("Iniciando login do aluno...");
    console.log("Requisição de login recebida!");
    console.log("Dados recebidos: ", { matricula, senha });

    try {
      console.log("Buscando aluno banco de dados...");
      const aluno = await Aluno.findOne({ where: { matricula } });


      if (!senha ) {
        console.warn("Senha não informada");
        return res.status(400).json({ error: "Informe a senha" });
      }

      if (aluno) {
        const senhaAluno = aluno.senha;

        bcrypt.compare(senha, senhaAluno, async (error, senhaValida) => {
          if (error) {
            console.error("Erro ao comparar senha:", error);
            return res.status(500).json({ message: "Erro ao comparar senha" });
          }

          if (senhaValida) {
            console.log("Aluno encontrado", aluno.dataValues);
            const payload = {
              id: aluno.id,
              nome: aluno.nome,
              tipo: "aluno",
            };
            console.log("Gerando token com payload:", payload);
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

            console.log("Token gerado com sucesso");

            res.status(200).json({
              token,
              mensagem: "Login realizado com sucesso",
            });
            return;
          } else {
            console.warn("Senha inválida");
            return res.status(401).json({ message: "Senha inválida" });
          }
        });
      } else{
        console.warn("Aluno não encontrado");
        return res.status(404).json({ error: "Aluno não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      return res.status(500).json({ error: "Erro ao realizar login" });
    }
  } else {
    const { siape, senha } = req.body;

    console.log("Iniciando login do professor...");
    console.log("Requisição de login recebida!");
    console.log("Dados recebidos: ", { siape, senha });

    if (!senha || !siape) {
      console.warn("Siape ou senha não informados");
      return res.status(400).json({ error: "Informe siape e senha" });
    }

    try {
      console.log("Buscando Professor no banco de dados...");

      const professor = await Professor.findOne({ where: { siape } });

      if (professor) {
        const senhaBd = professor.senha;

        bcrypt.compare(senha, senhaBd, async (error, senhaValida) => {
          if (error) {
            res.status(500).json({ message: "Erro ao comparar senha" });
            return;
          }

          if (senhaValida) {
            if (!professor) {
              console.log("Professor não encontrado!");
              return res
                .status(404)
                .json({ error: "Professor não encontrado" });
            }

            console.log("Professor encontrado", professor.dataValues);

            const payload = {
              id: professor.id,
              nome: professor.nome,
              tipo: "professor",
            };

            console.log("Gerando token com payload:", payload);
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

            console.log("Token gerado com sucesso");

            res.status(200).json({
              token,
              mensagem: " Login realizado com sucesso",
            });
            return;
          } else {
            res.status(401).json({ message: "Senha inválida" });
            return;
          }
        });
      } else {
        console.warn("Professor não encontrado");
        return res.status(404).json({ error: "Professor não encontrado" });
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      return res.status(500).json({ error: "Erro ao realizar login" });
    }
  }
};
