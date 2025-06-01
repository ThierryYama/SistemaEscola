import request from 'supertest';
import app from '../server'; 
import { Professor } from '../models/Professor'; 

describe('CRUD Professor', () => {
  let professorId: number;
  const professorData = {
    nome: 'João da Silva',
    email: `joao${Date.now()}@teste.com`,
    siape: `SIAPE${Date.now()}`,
    senha: 'senha123'
  };

  const professorAtualizado = {
    nome: 'João Atualizado',
    email: `joao.atualizado${Date.now()}@teste.com`,
    siape: `SIAPE-ATUALIZADO-${Date.now()}`,
    senha: 'novaSenha456'
  };

  it('Deve criar um professor', async () => {
    const response = await request(app)
      .post('/cadastrarProfessor')
      .send(professorData);

    expect(response.status).toBe(201);
    expect(response.body.novoProfessor).toHaveProperty('id');
    professorId = response.body.novoProfessor.id;
    console.log('ID do professor criado:', professorId);
  });

  it('Deve retornar os dados do professor criado', async () => {
    const response = await request(app)
      .get(`/buscarProfessor/${professorId}`);

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe(professorData.nome);
  });

  it('Deve atualizar os dados do professor', async () => {
    const response = await request(app)
      .put(`/atualizarProfessor/${professorId}`)
      .send(professorAtualizado);

    expect(response.status).toBe(200);
    expect(response.body.professorAtt.nome).toBe(professorAtualizado.nome);
  });

  it('Deve deletar o professor', async () => {
    const response = await request(app)
      .delete(`/deletarProfessor/${professorId}`);

    expect(response.status).toBe(204);
  });

  it('Deve retornar 404 ao buscar professor deletado', async () => {
    const response = await request(app)
      .get(`/professor/${professorId}`);

    expect(response.status).toBe(404);
  });
});
