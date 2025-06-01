import { Request, Response } from "express";
import {Aluno} from "../models/Aluno";
import { Presenca } from "../models/Presenca";
import { Disciplina } from "../models/Disciplina";

export const listarPresencasDoAluno = async (req: Request, res: Response) => {
    const {alunoId} = await req.params;
    
    const presencas = await Presenca.findAll({
        where: {alunoId},
    });
    res.status(200).json(presencas);
    return;
};


export const cadastrarPresenca = async (req: Request, res: Response,) => {
        
    try{
        const {alunoId, disciplinaId, data, presente}= req.body;
        let alunoExistente = await Aluno.findByPk(alunoId);
        let disciplinaExistente = await Disciplina.findByPk(disciplinaId);

        if(!alunoExistente || !disciplinaExistente){
            res.status(404).json({error: "Aluno ou Disciplina não encontrada."});
            return;
        }

        let novaPresenca = await Presenca.create({alunoId, disciplinaId, data, presente});
        res.status(201).json({
            message: "Presença cadastrada com sucesso.",
            novaPresenca,
        });
        return;
        
    } catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return;         
    }
};
    
export const atualizarPresenca = async (req: Request, res: Response) =>{    
    try{
        const {id_presenca} = req.params;
        const dadosAtualizados = req.body;
        
        const presenca = await Presenca.findByPk(id_presenca);

        if(!presenca){
            res.status(404).json({error: "Presença não encontrada"});
            return; 
        }

        const presencaAtt = await presenca.update(dadosAtualizados, {fields: Object.keys(dadosAtualizados)});

        res.status(200).json({message: "Nota atualizada", presencaAtt});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return; 
    }
};

export const deletarPresenca = async (req: Request, res: Response) =>{  
    try{
        const {id_presenca} = req.params;
        const presenca = await Presenca.findByPk(id_presenca);

        if(!presenca){
            res.status(404).json({error: "Presença não encontrada"});
            return; 
        }
  
        await presenca.destroy();
        res.status(200).json({message: "Presença deletada!"});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return;
    }
};
