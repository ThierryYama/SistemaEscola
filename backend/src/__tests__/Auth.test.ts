import request from 'supertest';
import app from '../server';
import bcrypt from 'bcrypt';
import { Aluno} from '../models/Aluno';
import {Professor } from '../models/Professor';

let aluno: any;
let professor: any;
let professorSenhaErrada: any;

beforeAll(async () => {
  const senhaHash = await bcrypt.hash('senha123', 10);

  aluno = await Aluno.create({
    nome: 'Aluno Teste',
    matricula: '12345611',
    senha: senhaHash,
    email: 'teste1@teste',
    id_turma: 1,
  });

  professor = await Professor.create({
    nome: 'Professor Teste',
    email: 'teste1@exemplo.com',
    siape: '65432111',
    senha: senhaHash,
  });

  professorSenhaErrada = await Professor.create({
    nome: 'Professor Teste',
    email: 'teste12@exemplo.com',
    siape: '98765411',
    senha: senhaHash,
  });
});

afterAll(async () => {
  await Aluno.destroy({ where: { matricula: aluno.matricula } });
  await Professor.destroy({ where: { siape: [professor.siape, professorSenhaErrada.siape] } });
});

describe('Testes de Autenticação', () => {
  it('Login de aluno bem-sucedido', async () => {
    const response = await request(app).post('/login').send({
      matricula: '12345611',
      senha: 'senha123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('Login de professor bem-sucedido', async () => {
    const response = await request(app).post('/login').send({
      siape: '65432111',
      senha: 'senha123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('Login com senha incorreta', async () => {
    const response = await request(app).post('/login').send({
      siape: '98765411',
      senha: 'errada',
    });

    expect(response.status).toBe(401);
  });

  it('Login com usuário inexistente', async () => {
    const response = await request(app).post('/login').send({
      siape: '000000',
      senha: 'senha123',
    });

    expect(response.status).toBe(404);
  });

  it('Login sem campo obrigatório', async () => {
    const response = await request(app).post('/login').send({
      siape: '65432111',
    });

    expect(response.status).toBe(400);
  });
});