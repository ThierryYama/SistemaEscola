import { Disciplina } from "./../models/Disciplina";
import { Request, Response } from "express";
import { Aluno } from "../models/Aluno";
import { AlunoDisciplina } from "../models/AlunoDisciplina";
import { Nota } from "../models/Nota";
import { Presenca } from "../models/Presenca";
//import { fn, col, Sequelize,  } from "sequelize";
import { Sequelize, where } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = "chavesecreta";

export const listarAlunos = async (req: Request, res: Response) => {
  const alunos = await Aluno.findAll();
  res.json(alunos);
};

export const cadastrarAluno = async (req: Request, res: Response) => {
  const { nome, email, senha, matricula, id_turma } = req.body;

  if (matricula) {
    let alunoExistente = await Aluno.findOne({ where: { matricula } });
    if (!alunoExistente) {

      const saltRounds = 10;

      bcrypt.hash(senha, saltRounds, async (error, senhaCriptografada) => {
        if (error) {
          res.status(500).json({ error: "Erro ao criptografar a senha" });
          return;
        } else {
          let novoAluno = await Aluno.create({
            nome,
            email,
            senha: senhaCriptografada,
            matricula,
            id_turma,
          });

          res.status(201).json({
            message: "Aluno cadastrado com sucesso.",
            novoAluno,
          });
        }
      });
    } else {
      res.status(400).json({ error: "Matricula do aluno já existe." });
      return;
    }
  }
};

export const atualizarAluno = async (req: Request, res: Response) => {
  try {
    const { alunoId } = req.params;
    const dadosAtualizados = req.body;

    const aluno = await Aluno.findByPk(alunoId);

    if (!aluno) {
      res.status(404).json({ error: "Aluno não encontrado" });
      return;
    }

    const alunoAtt = await aluno.update(dadosAtualizados, {
      fields: Object.keys(dadosAtualizados),
    });

    res.status(200).json({ message: "Aluno atualizado", alunoAtt });
    return;
  } catch (error) {
    res.status(400).json({ message: "Erro do sistema", error });
    return;
  }
};

export const deletarAluno = async (req: Request, res: Response) => {
  try {
    const { alunoId } = req.params;
    const aluno = await Aluno.findByPk(alunoId);

    const alunoDisciplina = await AlunoDisciplina.findByPk(alunoId);
    const alunoNota = await Nota.findByPk(alunoId);
    const alunoPresenca = await Presenca.findByPk(alunoId);

    if (!aluno) {
      res.status(404).json({ error: "Aluno não encontrado" });
      return;
    }

    /*if (alunoDisciplina || alunoNota || alunoPresenca) {
      res.status(200).json({
        message: "Erro! Aluno já vinculado a uma Disciplina/Nota/Presença!",
      });
      return;
    } */

    await aluno.destroy();
    res.status(204).json({ message: "Aluno deletado!" });
    return
    
  } catch (error) {
    res.status(400).json({ message: "Erro do sistema", error });
    return;
  }
};

export const listarNotasComMedia = async (req: Request, res: Response) => {
  try {
    const { alunoId } = req.params;
    const aluno = await Aluno.findByPk(alunoId);
    if (!aluno) {
      res.status(404).json({ error: "Aluno não encontrado" });
      return;
    }

    const notas = await Nota.findAll({
      where: { alunoId },
      include: [
        {
          model: Disciplina,
          attributes: ["nome"],
        },
      ],
    });

    const medias = await Nota.findAll({
      where: { alunoId },
      attributes: [
        "disciplinaId",
        [Sequelize.fn("AVG", Sequelize.col("nota")), "media"],
      ],
      include: [
        {
          model: Disciplina,
          attributes: ["nome"],
        },
      ],
      group: ["disciplinaId", "Disciplina.id", "Disciplina.nome"],
    });

    res.status(200).json({ notas, medias });
  } catch (error) {
    res.status(400).json({ message: "Erro do sistema", error });
    return;
  }
};

export const presencaPercentual = async (req: Request, res: Response) => {
  try {
    const { alunoId } = req.params;
    const aluno = await Aluno.findByPk(alunoId);
    if (!aluno) {
      res.status(404).json({ error: "Aluno não encontrado" });
      return;
    }

    const presencas = await Presenca.findAll({
      attributes: [
        "disciplinaId",
        [Sequelize.fn("SUM", Sequelize.col("presente")), "presencaTot"],
        [Sequelize.fn("COUNT", Sequelize.col("*")), "totalAulas"],
        [
          Sequelize.literal("SUM(presente) / COUNT(*) * 100"),
          "percentualPresenca",
        ],
      ],
      where: { alunoId },
      include: [
        {
          model: Disciplina,
          attributes: ["nome"],
        },
      ],
      group: ["disciplinaId", "Disciplina.id", "Disciplina.nome"],
    });

    res.status(200).json({ presencas });
  } catch (error) {
    res.status(400).json({ message: "Erro do sistema", error });
    return;
  }
};

export const listarAlunosReprovados = async (req: Request, res: Response) => {
  try {
    const { alunoId } = req.params;
    const aluno = await Aluno.findByPk(alunoId);

    if (!aluno) {
      res.status(404).json({ error: "Aluno não encontrado" });
    }

    const disciplinas = await Disciplina.findAll({
      include: [
        {
          model: Aluno,
          where: { id: alunoId },
          attributes: [],
        },
      ],
      attributes: ["id", "nome"],
    });

    const resultados = await Promise.all(
      disciplinas.map(async (disciplina) => {
        const medias = (await Nota.findOne({
          where: { alunoId, disciplinaId: disciplina.id },
          attributes: [
            "disciplinaId",
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
          where: { alunoId, disciplinaId: disciplina.id },
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
              : "Reprovado (Presença)";
        } else {
          resultPresenca = "Sem presença";
        }

        return {
          aluno: aluno?.nome,
          disciplinaId: disciplina.id,
          disciplina: disciplina.nome,
          media: media,
          mediaP: mediaPresenca,
          resultMedia,
          resultPresenca,
        };
      })
    );

    res.json(resultados);
    return;
  } catch (error) {
    res.status(400).json({ message: "Erro do sistema", error });
    return;
  }
};

export const loginAluno = async (req: Request, res: Response): Promise<any> => {
  const { matricula, senha } = req.body;

  console.log("Requisição de login recebida!");
  console.log("Dados recebidos: ", { matricula, senha });

  if (!senha || !matricula) {
    console.warn("Email ou senha não informados");
    return res.status(400).json({ error: "Informe email e matricula" });
  }

  try {
    console.log("Buscando aluno banco de dados...");
    const aluno = await Aluno.findOne({ where: { matricula, senha } });

    if (!aluno) {
      console.log("Aluno não encontrado!");
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    console.log("Aluno encontrado", aluno.dataValues);

    const payload = {
      id: aluno.id,
      matricula: aluno.matricula,
      senha: aluno.senha,
      tipo: "aluno",
    };

    console.log("Gerando token com payload:", payload);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });

    console.log("Token gerado com sucesso");

    res.json({
      token,
      mensagem: "Aluno logado com sucesso",
    })
    return;
  } catch (error) {

    console.error('Erro ao realizar login:', error)
    return res.status(500).json({ error: 'Erro ao realizar login' })
  }
};

export const buscarAluno = async (req: Request, res: Response) => {
    const {alunoId} = req.params;
    console.log("Buscando aluno com ID:", alunoId);
    const aluno = await Aluno.findByPk(alunoId);     
    console.log("Dados recebidos:",  aluno);

    if(!aluno){
        res.status(404).json({ error: "Aluno não encontrado."});
        return;
    }

    res.status(200).json(aluno);
    return

    
};