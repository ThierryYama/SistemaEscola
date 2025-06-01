import request from 'supertest';
import app from '../server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Professor } from '../models/Professor';
import { Aluno } from '../models/Aluno';

const JWT_SECRET = process.env.JWT_SECRET || 'senha';

let professor: any;
let aluno: any;

beforeAll(async () => {
  const senhaHash = await bcrypt.hash('senha123', 10);

  professor = await Professor.create({
    nome: 'Professor Middleware',
    email: 'middleware1@teste.com',
    siape: '99999991',
    senha: senhaHash,
  });

  const senhaHashAluno = await bcrypt.hash('senha123', 10);

  aluno = await Aluno.create({
    nome: 'Aluno Middleware',
    email: 'middleware1@teste.com',
    matricula: '9999999',
    senha: senhaHashAluno,
    id_turma: 1,
  });
});

afterAll(async () => {
  await Professor.destroy({ where: { siape: '9999999' } });
});

describe('Testes do Middleware de Autenticação', () => {
  it('🟢 Extração do tipo de usuário (professor)', async () => {
    const token = jwt.sign({ id: professor.id, nome: professor.nome, tipo: 'professor' }, JWT_SECRET);

    const response = await request(app)
      .get('/listarProfessores')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });

  it('🔴 Token inválido → acesso negado', async () => {
    const response = await request(app)
      .get('/listarProfessores')
      .set('Authorization', 'Bearer tokeninvalido');

    expect(response.status).toBe(403);
  });

  it('🔴 Token ausente → acesso negado', async () => {
    const response = await request(app)
      .get('/listarProfessores');

    expect(response.status).toBe(401);
  });


  it('🟢 Qualquer usuário logado pode acessar', async () => {
    const tokenProf = jwt.sign({ id: professor.id, nome: professor.nome, tipo: 'professor' }, JWT_SECRET);
    const tokenAluno = jwt.sign({id: aluno.id, nome: aluno.nome, tipo: 'aluno' }, JWT_SECRET);

    const responseProf = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${tokenProf}`);
    
    const responseAluno = await request(app)
    .get('/dashboard')
    .set('Authorization', `Bearer ${tokenAluno}`); 

    expect(responseProf.status).not.toBe(401);
    expect(responseProf.status).not.toBe(403);

    expect(responseAluno.status).not.toBe(401);
    expect(responseAluno.status).not.toBe(403);
  });

  it('🟢 Professores e alunos podem acessar', async () => {
    const tokenProf = jwt.sign({ id: professor.id, nome: professor.nome, tipo: 'professor' }, JWT_SECRET);
    const tokenAluno = jwt.sign({id: aluno.id, nome: aluno.nome, tipo: 'aluno' }, JWT_SECRET);

    const responseProf = await request(app)
      .get('/listarProfessores')
      .set('Authorization', `Bearer ${tokenProf}`);
    
    const responseAluno = await request(app)
    .get('/listarProfessores')
    .set('Authorization', `Bearer ${tokenAluno}`); 

    expect(responseProf.status).not.toBe(401);
    expect(responseProf.status).not.toBe(403);

    expect(responseAluno.status).not.toBe(401);
    expect(responseAluno.status).not.toBe(403);
  });

  it('🟢 Professores podem acessar e 🔴 Alunos recebem acesso negado', async () => {
    const tokenProf = jwt.sign({ id: professor.id, nome: professor.nome, tipo: 'professor' }, JWT_SECRET);
    const tokenAluno = jwt.sign({id: aluno.id, nome: aluno.nome, tipo: 'aluno' }, JWT_SECRET);

    const responseProf = await request(app)
      .get('/listarAlunos')
      .set('Authorization', `Bearer ${tokenProf}`);
    
    const responseAluno = await request(app)
    .get('/listarAlunos')
    .set('Authorization', `Bearer ${tokenAluno}`); 

    expect(responseProf.status).not.toBe(401);
    expect(responseProf.status).not.toBe(403);

    expect(responseAluno.status).toBe(403);
  });
});


