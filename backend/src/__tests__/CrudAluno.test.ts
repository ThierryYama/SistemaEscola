import request from 'supertest';
import app from '../server'; 
import { Professor } from '../models/Professor'; 

describe('CRUD Aluno', () => {
  let alunoId: number;
  const alunoData = {
    nome: 'Pedro Yama',
    email: `pedro${Date.now()}@teste.com`,
    matricula: `MATRICULA${Date.now()}`,
    senha: 'senha123',
    id_turma: 1 
  };

  const alunoAtualizado = {
    nome: 'Pedro Atualizado',
    email: `pedro.atualizado${Date.now()}@teste.com`,
    siape: `MATRICULA-ATUALIZADO-${Date.now()}`,
    senha: 'novaSenha456'
  };

  it('Deve criar um aluno', async () => {
    const response = await request(app)
      .post('/cadastrarAluno')
      .send(alunoData);

    expect(response.status).toBe(201);
    expect(response.body.novoAluno).toHaveProperty('id');
    alunoId = response.body.novoAluno.id;
    console.log('ID do professor criado:', alunoId);
  });

  it('Deve retornar os dados do aluno criado', async () => {
    const response = await request(app)
      .get(`/buscarAluno/${alunoId}`);

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe(alunoData.nome);
  });

  it('Deve atualizar os dados do aluno', async () => {
    const response = await request(app)
      .put(`/atualizarAluno/${alunoId}`)
      .send(alunoAtualizado);

    expect(response.status).toBe(200);
    expect(response.body.alunoAtt.nome).toBe(alunoAtualizado.nome);
  });

  it('Deve deletar o aluno', async () => {
    const response = await request(app)
      .delete(`/deletarAluno/${alunoId}`);

    expect(response.status).toBe(204);
  });

  it('Deve retornar 404 ao buscar aluno deletado', async () => {
    const response = await request(app)
      .get(`/buscarAluno/${alunoId}`);

    expect(response.status).toBe(404);
  });
});
