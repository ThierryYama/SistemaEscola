import { Request, Response } from "express";
import { listarAlunosReprovados } from "../controllers/AlunoController"; 
import { Aluno } from "../models/Aluno";
import { Disciplina } from "../models/Disciplina";
import { Nota } from "../models/Nota";
import { Presenca } from "../models/Presenca";


jest.mock("../models/Aluno", () => ({
  Aluno: { findByPk: jest.fn() },
}));
jest.mock("../models/Disciplina", () => ({
  Disciplina: { findAll: jest.fn() },
}));
jest.mock("../models/Nota", () => ({
  Nota: { findOne: jest.fn() },
}));
jest.mock("../models/Presenca", () => ({
  Presenca: { findOne: jest.fn() },
}));

describe("listarAlunosReprovados – regra de média", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    
    req = { params: { alunoId: "1" } };
    
    statusMock = jest.fn().mockReturnThis();
    jsonMock   = jest.fn();
    res = { status: statusMock, json: jsonMock } as any;

    jest.clearAllMocks();
  });

  it("deve retornar Aprovado (nota) quando média ≥ 7", async () => {
   
    (Aluno.findByPk as jest.Mock).mockResolvedValue({ id: 1, nome: "João" });
    
    (Disciplina.findAll as jest.Mock).mockResolvedValue([
      { id: 10, nome: "Matemática" }
    ]);
    
    (Nota.findOne as jest.Mock).mockResolvedValue({ media: "8.0" });
    
    (Presenca.findOne as jest.Mock).mockResolvedValue(null);

    await listarAlunosReprovados(req as Request, res as Response);

    expect(jsonMock).toHaveBeenCalledWith([
      expect.objectContaining({
        aluno:         "João",
        disciplinaId:  10,
        disciplina:    "Matemática",
        media:         8.0,
        resultMedia:   "Aprovado (nota)",
        resultPresenca: "Sem presença",
      }),
    ]);
  });

  it("deve retornar Reprovado (nota) quando média < 7", async () => {
    (Aluno.findByPk as jest.Mock).mockResolvedValue({ id: 1, nome: "Maria" });
    (Disciplina.findAll as jest.Mock).mockResolvedValue([
      { id: 20, nome: "História" }
    ]);
    (Nota.findOne as jest.Mock).mockResolvedValue({ media: "5.5" });
    (Presenca.findOne as jest.Mock).mockResolvedValue(null);

    await listarAlunosReprovados(req as Request, res as Response);

    expect(jsonMock).toHaveBeenCalledWith([
      expect.objectContaining({
        aluno:         "Maria",
        disciplinaId:  20,
        disciplina:    "História",
        media:         5.5,
        resultMedia:   "Reprovado (nota)",
        resultPresenca: "Sem presença",
      }),
    ]);
  });

  it("deve retornar 404 se aluno não existir", async () => {
    (Aluno.findByPk as jest.Mock).mockResolvedValue(null);

    await listarAlunosReprovados(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: "Aluno não encontrado" });
  });
});
