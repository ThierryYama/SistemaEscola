import { Disciplina } from './../models/Disciplina';
import { Request, Response } from "express";
import { AlunoDisciplina } from '../models/AlunoDisciplina';
import { presencaPercentual } from './AlunoController';
import { Presenca } from '../models/Presenca';
import { Aluno } from '../models/Aluno';
import { Nota } from '../models/Nota';
import { Sequelize } from 'sequelize-typescript';


export const listarDisciplinas = async (req: Request, res: Response) => {
    const disciplinas = await Disciplina.findAll();
    res.json(disciplinas);
};


export const cadastrarDisciplina = async (req: Request, res: Response,) => {
    const {nome, id_professor}= req.body;

    if(nome){
        let disciplinaExistente = await Disciplina.findOne({ where: {nome}});
        
        if(!disciplinaExistente){
            let novaDisciplina = await Disciplina.create({nome, id_professor});

            res.status(201);
            res.json({
                message: "Disciplina cadastrada com sucesso.",
                novaDisciplina
            });
            return;
        } else {
            res.status(400).json({error: "Nome da discplina já existe."});
            return;
        }
    }

    res.status(400).json({error: "Nome da disciplina não enviado."});
    return;
};



export const atualizarDisciplina = async (req: Request, res: Response) =>{    
    try{
        const {disciplinaId} = req.params;
        const dadosAtualizados = req.body;
        
        const disciplina = await Disciplina.findByPk(disciplinaId);

        if(!disciplina){
            res.status(404).json({error: "Disciplina não encontrado"});
            return; 
        }

        const discAtt = await disciplina.update(dadosAtualizados, {fields: Object.keys(dadosAtualizados)});

        res.status(200).json({message: "disciplina atualizado", discAtt});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return; 
    }
};

export const deletarDisciplina = async (req: Request, res: Response) =>{  
    try{
        const {disciplinaId} = req.params;
        const disciplina = await Disciplina.findByPk(disciplinaId);

        const disciplinaAluno = await AlunoDisciplina.findByPk(disciplinaId);

        if(!disciplina){
            res.status(404).json({error: "Disciplina não encontrada"});
            return; 
        }

        if(disciplinaAluno){
            res.status(200).json({message: "Erro! Disciplina já vinculado a um aluno!"});
            return;
        }   
        
        await disciplina.destroy();
        res.status(200).json({message: "Disciplina deletada!"});
        return;

    }catch(error){
        res.status(400).json({message: "Erro do sistema", error});
        return;
    }
};


export const buscarDisciplinaPeloID = async (req: Request, res: Response) => {
    
    const {disciplinaId} = req.params;

    const disciplina = await Disciplina.findByPk(disciplinaId);
    res.status(200).json(disciplina);
    return;
};

/*export const alunosReprovados = async (req: Request, res: Response) => {
    let situacaoP: boolean;
    let situacaoM: boolean;

    const { disciplinaId } = req.params;

    const alunosMatriculados = await AlunoDisciplina.findAll({
        where: {
            disciplinaId: disciplinaId,
        },
        include: [
            {
                model: Aluno,
                attributes: ["id","nome"],
            },
        ],
    });

    const resultados = await Promise.all (
        alunosMatriculados.map(async (matricula) => {
            const alunoId = matricula.alunoId;

            const medias = (await Nota.findOne({
                where: { alunoId: alunoId, disciplinaId: disciplinaId },
                attributes: [
                  "disciplinaId",
                  [Sequelize.fn("AVG", Sequelize.col("nota")), "media"],
                ],
                raw: true,
              })) as { media: string | null } | null;
        
              const media = medias?.media ? parseFloat(medias.media) : null;
  
              if (media !== null){
                if (media < 7){
                    situacaoM = false;
                } else {
                    situacaoM = true;
                }
              }

            const presencas = (await Presenca.findOne({
                attributes: [
                  "disciplinaId",
                  [Sequelize.fn("SUM", Sequelize.col("presente")), "presencaTot"],
                  [Sequelize.fn("COUNT", Sequelize.col("*")), "totalAulas"],
                  [
                    Sequelize.literal("SUM(presente) / COUNT(*) * 100"),
                    "percentualPresenca",
                  ],
                ],
                where: { alunoId:alunoId, disciplinaId: disciplinaId },
                raw: true,
              })) as { percentualPresenca: string | null } | null;
              
              const mediaPresenca = presencas?.percentualPresenca ? parseFloat(presencas.percentualPresenca): null;

              if(mediaPresenca !== null){
                if (mediaPresenca < 75) {
                    situacaoP = false;
                } else {
                    situacaoP = true;
                }
              }

              if(situacaoM === false && situacaoP === false){
                return {
                    alunoId: alunoId,
                    media: media,
                    Situação: "Reprovado",
                };
              } else{
                return {
                    Situação: "Aprovado"
                }
              };
        },
    );
    
    res.status(200).json(resultados);
    return;
};*/

export const alunosReprovados = async (req: Request, res: Response) => {
    try {
      const { disciplinaId } = req.params;
      const disciplina = await Disciplina.findByPk(disciplinaId);
  
      if (!disciplina) {
        res.status(404).json({ error: "Disciplina não encontrada" });
      }
  
      const alunos = await Aluno.findAll({
        include: [
          {
            model:Disciplina,
            where: { id: disciplinaId },
            attributes: [],
          },
        ],
        attributes: ["id", "nome"],
      });
        
        const resultados = await Promise.all(
          alunos.map(async (aluno) => {
              const medias = (await Nota.findOne({
                where: { disciplinaId, alunoId: aluno.id },
                attributes: [
                  "alunoId",
                  [Sequelize.fn("AVG", Sequelize.col("nota")), "media"],
                ],
                raw: true,
              })) as { media: string | null } | null;
        
              const media = medias?.media ? parseFloat(medias.media) : null;
  
              let resultMedia;
  
              if (media !== null) {
                resultMedia = media >= 7 ? "Aprovado (nota)" : "Reprovado (nota)";
              } else {
                resultMedia = "Sem nota";
              }
        
              const presencas = (await Presenca.findOne({
                attributes: [
                  "disciplinaId",
                  [Sequelize.fn("SUM", Sequelize.col("presente")), "presencaTot"],
                  [Sequelize.fn("COUNT", Sequelize.col("*")), "totalAulas"],
                  [
                    Sequelize.literal("SUM(presente) / COUNT(*) * 100"),
                    "percentualPresenca",
                  ],
                ],
                where: { disciplinaId, alunoId: aluno.id },
                raw: true,
              })) as { percentualPresenca: string | null } | null;
        
              const mediaPresenca = presencas?.percentualPresenca
                ? parseFloat(presencas.percentualPresenca)
                : null;
              
              let resultPresenca;
              
              if (mediaPresenca !== null) {
                resultPresenca =
                  mediaPresenca >= 75
                    ? "Aprovado (presença)"
                    : "Reprovado (presença)";
              } else {
                resultPresenca = "Sem presença";
              }
              
              return {
                id: aluno.id,
                nome: aluno.nome,
                media: media,
                percentualPresenca: mediaPresenca,
                resultMedia,
                resultPresenca,
              }
            
            }),
        );
        
        const reprovados = resultados.filter(resultado => 
            resultado.resultMedia === "Reprovado (nota)" || 
            resultado.resultPresenca === "Reprovado (presença)"
          );

        res.json(reprovados);
        return;

    } catch (error) {
        res.status(400).json({ message: "Erro do sistema", error });
        return;
    };
};