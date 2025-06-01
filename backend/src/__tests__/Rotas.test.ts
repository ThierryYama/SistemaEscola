import request from 'supertest';
import app from '../server'; 
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seusegredoseguro';

describe('Rotas Acadêmicas', () => {
  const tokenProfessor = jwt.sign({ tipo: 'professor' }, JWT_SECRET);
  const tokenAluno = jwt.sign({ tipo: 'aluno' }, JWT_SECRET);

  describe('GET /listarNotasComMedia/:alunoId', () => {
    it('✅ deve retornar 200 se o aluno existir e for professor', async () => {
      const res = await request(app)
        .get('/listarNotasComMedia/1')
        .set('Authorization', `Bearer ${tokenProfessor}`);
      expect(res.statusCode).toBe(200);
    });

    it('⛔ deve retornar 403 se o usuário for aluno', async () => {
      const res = await request(app)
        .get('/listarNotasComMedia/1')
        .set('Authorization', `Bearer ${tokenAluno}`);
      expect(res.statusCode).toBe(403);
    });

    it('⛔ deve retornar 404 se o aluno não existir', async () => {
      const res = await request(app)
        .get('/listarNotasComMedia/9999')
        .set('Authorization', `Bearer ${tokenProfessor}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /percentualPresenca/:alunoId', () => {
    it('✅ deve retornar 200 se o aluno existir e for professor', async () => {
      const res = await request(app)
        .get('/percentualPresenca/1')
        .set('Authorization', `Bearer ${tokenProfessor}`);
      expect(res.statusCode).toBe(200);
    });

    it('⛔ deve retornar 403 se o usuário for aluno', async () => {
      const res = await request(app)
        .get('/percentualPresenca/1')
        .set('Authorization', `Bearer ${tokenAluno}`);
      expect(res.statusCode).toBe(403);
    });

    it('⛔ deve retornar 404 se o aluno não existir', async () => {
      const res = await request(app)
        .get('/percentualPresenca/9999')
        .set('Authorization', `Bearer ${tokenProfessor}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /alunosReprovados/:disciplinaId', () => {
    it('✅ deve retornar 200 e a lista de reprovados se a disciplina existir e for professor', async () => {
      const res = await request(app)
        .get('/alunosReprovados/1')
        .set('Authorization', `Bearer ${tokenProfessor}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('⛔ deve retornar 403 se o usuário for aluno', async () => {
      const res = await request(app)
        .get('/alunosReprovados/1')
        .set('Authorization', `Bearer ${tokenAluno}`);
      expect(res.statusCode).toBe(403);
    });

    it('⛔ deve retornar 404 se a disciplina não existir', async () => {
      const res = await request(app)
        .get('/alunosReprovados/9999')
        .set('Authorization', `Bearer ${tokenProfessor}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /listarAlunosReprovados/:alunoId', () => {
    it('✅ deve retornar 200 se o aluno existir e for professor', async () => {
      const res = await request(app)
        .get('/listarAlunosReprovados/1')
        .set('Authorization', `Bearer ${tokenProfessor}`);
      expect(res.statusCode).toBe(200);
    });

    it('⛔ deve retornar 403 se o usuário for aluno', async () => {
      const res = await request(app)
        .get('/listarAlunosReprovados/1')
        .set('Authorization', `Bearer ${tokenAluno}`);
      expect(res.statusCode).toBe(403);
    });

    it('⛔ deve retornar 404 se o aluno não existir', async () => {
      const res = await request(app)
        .get('/listarAlunosReprovados/9999')
        .set('Authorization', `Bearer ${tokenProfessor}`);
      expect(res.statusCode).toBe(404);
    });
  });
});
