import { Request, Response } from "express";
import { Curso } from "../models/Curso";
import { Turma } from "../models/Turma";

export const listarCursos = async (req: Request, res: Response) => {
    const cursos = await Curso.findAll();
    res.json(cursos);
};


export const cadastrarCurso = async (req: Request, res: Response,) => {
    const {nome, descricao}= req.body;

    if(nome){
        let cursoExistente = await Curso.findOne({ where: {nome}});
        if(!cursoExistente){
            let novoCurso = await Curso.create({nome,descricao});
            res.status(201);
            res.json({
                message: "Curso cadastrado com sucesso.",
                novoCurso,
            });
            return;
        } else {
            res.status(400).json({error: "Nome do curso já existe."});
            return;
        }
    }

    res.status(400).json({error: "Nome do curso não enviado."});
    return;
};



export const atualizarCurso = async (req: Request, res: Response) =>{    
    try{
        const {id_curso} = req.params;
        const dadosAtualizados = req.body;
        
        const curso = await Curso.findByPk(id_curso);

        if(!curso){
            res.status(404).json({error: "Curso não encontrado"});
            return; 
        }

        const cursoAtt = await curso.update(dadosAtualizados, {fields: Object.keys(dadosAtualizados)});

        res.status(200).json({message: "Curso atualizado", cursoAtt});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return; 
    }
};

export const deletarCurso = async (req: Request, res: Response) =>{  
    try{
        const {id_curso} = req.params;
        const curso = await Curso.findByPk(id_curso);

        const cursoTurma = await Turma.findByPk(id_curso);

        if(!curso){
            res.status(404).json({error: "Curso não encontrado"});
            return; 
        }

        if(cursoTurma){
            res.status(200).json({message: "Erro! Curso já vinculado a uma Turma!"});
            return;
        }   
        
        await curso.destroy();
        res.status(200).json({message: "Curso deletado!"});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema"});
        return;
    }
};
