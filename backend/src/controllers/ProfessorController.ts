import { Request, Response } from "express";
import { Professor } from "../models/Professor";
import { Disciplina } from "../models/Disciplina";
import bcrypt from "bcrypt";

export const listarProfessores = async (req: Request, res: Response) => {
    const professores = await Professor.findAll();
    res.json(professores);
};


export const cadastrarProfessor = async (req: Request, res: Response,) => {
    const { nome, email, siape, senha } = req.body;

    if (siape) {
        let professorExistente = await Professor.findOne({ where: { siape } });
        if (!professorExistente) {
            // Criptografar a senha
            const saltRounds = 10;

            bcrypt.hash(senha, saltRounds, async (error, senhaCriptografada) => {
                if (error) {
                    res.status(500).json({ error: "Erro ao criptografar a senha" });
                    return;
                } else {
                    let novoProfessor = await Professor.create({
                        nome,
                        email,
                        siape,
                        senha: senhaCriptografada,
                    });

                    res.status(201).json({
                        message: "Professor cadastrado com sucesso.",
                        novoProfessor,
                    });
                }
            });
        } else {
            res.status(400).json({ error: "Siape do professor já existe." });
            return;
        }
    }
};



export const atualizarProfessor = async (req: Request, res: Response) => {
    try {
        const { id_professor } = req.params;
        const dadosAtualizados = req.body;

        const professor = await Professor.findByPk(id_professor);

        if (!professor) {
            res.status(404).json({ error: "Professor não encontrado" });
            return;
        }

        const professorAtt = await professor.update(dadosAtualizados, { fields: Object.keys(dadosAtualizados) });

        res.status(200).json({ message: "Professor atualizado", professorAtt });
        return;

    } catch (error) {
        res.status(400).json({ message: "Erro do sistema", error });
        return;
    }
};

export const deletarProfessor = async (req: Request, res: Response) => {
    try {
        const { id_professor } = req.params;
        const professor = await Professor.findByPk(id_professor);

        const professorDisciplina = await Disciplina.findByPk(id_professor);

        if (!professor) {
            res.status(404).json({ error: "Professor não encontrado" });
            return;
        }

        if (professorDisciplina) {
            res.status(200).json({ message: "Erro! Professor já vinculado a uma disciplina!" });
            return;
        }

        await professor.destroy();
        res.status(204).json({ message: "Professor deletado!" });
        return;

    } catch (error) {
        res.status(400).json({ message: "Erro do sistema", error });
        return;
    }
};

export const buscarProfessor = async (req: Request, res: Response) => {
    const {id_professor} = req.params;
    console.log("Buscando professor com ID:", id_professor);
    const professor = await Professor.findByPk(id_professor);     
    console.log("Dados recebidos:",  professor);

    if(!professor){
        res.status(404).json({ error: "Professor não encontrado."});
        return;
    }

    res.status(200).json(professor);
    return

    
};