import { Request, Response } from "express";
import { Turma } from "../models/Turma";
import { Aluno } from "../models/Aluno";

export const listarTurmas = async (req: Request, res: Response) => {
    try{
        const turmas = await Turma.findAll();
        res.json(turmas);
        return;
    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return; 
    }
};


export const cadastrarTurma = async (req: Request, res: Response,) => {
    const {nome, periodo, id_curso}= req.body;

    if(nome){
        let turmaExistente = await Turma.findOne({ where: {nome}});
        if(!turmaExistente){
            let novaTurma = await Turma.create({nome,periodo, id_curso});
            res.status(201);
            res.json({
                message: "Turma cadastrada com sucesso.",
                novaTurma,
            });
            return;
        } else {
            res.status(400).json({error: "Nome da turma já existe."});
            return;
        }
    }

    res.status(400).json({error: "Nome da turma não enviado."});
    return;
};


export const atualizarTurma = async (req: Request, res: Response) =>{    
    try{
        const {id_turma} = req.params;
        const dadosAtualizados = req.body;
        
        const turma = await Turma.findByPk(id_turma);

        if(!turma){
            res.status(404).json({error: "Turma não encontrada"});
            return; 
        }

        const turmaAtt = await turma.update(dadosAtualizados, {fields: Object.keys(dadosAtualizados)});

        res.status(200).json({message: "Turma atualizada", turmaAtt});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return; 
    }
}; 


export const deletarTurma = async (req: Request, res: Response) =>{  
    try{
        const {id_turma} = req.params;
        const turma = await Turma.findByPk(id_turma);

       const turmaRelacionada = await Turma.findOne({
            where: {id: id_turma},
            include:[
                {
                    model: Aluno,
                    where:{id_turma: id_turma},
                    required: true,
                }
            ]
       });

        if(!turma){
            res.status(404).json({error: "Turma não encontrada"});
            return; 
        }

        if(turmaRelacionada){
            res.status(200).json({message: "Erro! Turma já vinculada a um aluno!"});
            return;
        }   
        
        await turma.destroy();
        res.status(200).json({message: "Turma deletada!"});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return;
    } 
}; 
