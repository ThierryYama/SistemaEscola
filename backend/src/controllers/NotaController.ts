import { Request, Response } from "express";
import {Aluno} from "../models/Aluno";
import { Nota } from "../models/Nota";
import { Disciplina } from "../models/Disciplina";

export const listarNotasDoAluno = async (req: Request, res: Response) => {
    const {alunoId} = await req.params;
    
    const notas = await Nota.findAll({
        where: {alunoId},
    });
    res.status(200).json(notas);
    return;
};


export const cadastrarNota = async (req: Request, res: Response,) => {
        
    try{
        const {alunoId, disciplinaId, nota, data_avaliacao}= req.body;
        let alunoExistente = await Aluno.findByPk(alunoId);
        let disciplinaExistente = await Disciplina.findByPk(disciplinaId);

        if(!alunoExistente || !disciplinaExistente){
            res.status(404).json({error: "Aluno ou Disciplina não encontrada."});
            return;
        }

        let novaNota = await Nota.create({alunoId, disciplinaId, nota, data_avaliacao});
        res.status(201).json({
            message: "Nota cadastrada com sucesso.",
            novaNota,
        });
        return;
        
    } catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return;         
    }
};
    
export const atualizarNota = async (req: Request, res: Response) =>{    
    try{
        const {id_nota} = req.params;
        const dadosAtualizados = req.body;
        
        const nota = await Nota.findByPk(id_nota);

        if(!nota){
            res.status(404).json({error: "Nota não encontrada"});
            return; 
        }

        const notaAtt = await nota.update(dadosAtualizados, {fields: Object.keys(dadosAtualizados)});

        res.status(200).json({message: "Nota atualizada", notaAtt});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return; 
    }
};

export const deletarNota = async (req: Request, res: Response) =>{  
    try{
        const {id_nota} = req.params;
        const nota = await Nota.findByPk(id_nota);

        if(!nota){
            res.status(404).json({error: "Nota não encontrada"});
            return; 
        }
  
        await nota.destroy();
        res.status(200).json({message: "Nota deletada!"});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return;
    }
};
