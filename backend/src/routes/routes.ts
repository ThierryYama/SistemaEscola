import { Router } from 'express';

import * as ApiController from '../controllers/apiController';

import * as CursoController from '../controllers/CursoController';
import * as TurmaController from '../controllers/TurmaController';
import * as AlunoController from '../controllers/AlunoController';
import * as ProfessorController from '../controllers/ProfessorController';
import * as DisciplinaController from '../controllers/DisciplinaController';
import * as AlunoDisciplinaController from '../controllers/AlunoDisciplinaController';
import * as NotaController from '../controllers/NotaController';
import * as PresencaController from '../controllers/PresencaController';
import * as LoginController from '../controllers/LoginController';

import { autenticarTokenProfessor, autenticarTokenGeral } from '../middlewares/auth';


const router = Router();
router.get('/ping', ApiController.ping)

router.post('/cadastrarCurso', CursoController.cadastrarCurso);
router.get('/listarCursos', CursoController.listarCursos);
router.put('/atualizarCurso/:id_curso', CursoController.atualizarCurso);
router.delete('/deletarCurso/:id_curso', CursoController.deletarCurso);

router.post('/cadastrarTurma', TurmaController.cadastrarTurma);
router.get('/listarTurmas', TurmaController.listarTurmas);
router.put('/atualizarTurma/:id_turma', TurmaController.atualizarTurma);
router.delete('/deletarTurma/:id_turma', TurmaController.deletarTurma);

router.post('/cadastrarAluno', AlunoController.cadastrarAluno);
router.get('/listarAlunos', autenticarTokenProfessor, AlunoController.listarAlunos);
router.put('/atualizarAluno/:alunoId', AlunoController.atualizarAluno);
router.delete('/deletarAluno/:alunoId', AlunoController.deletarAluno);
router.get('/buscarAluno/:alunoId', AlunoController.buscarAluno);


router.post('/cadastrarProfessor', ProfessorController.cadastrarProfessor);
router.get('/listarProfessores',  autenticarTokenGeral, ProfessorController.listarProfessores);
router.put('/atualizarProfessor/:id_professor', ProfessorController.atualizarProfessor);
router.delete('/deletarProfessor/:id_professor', ProfessorController.deletarProfessor);
router.get('/buscarProfessor/:id_professor', ProfessorController.buscarProfessor);


router.post('/cadastrarDisciplina', DisciplinaController.cadastrarDisciplina);
router.get('/listarDisciplinas', DisciplinaController.listarDisciplinas);
router.put('/atualizarDisciplina/:disciplinaId', DisciplinaController.atualizarDisciplina);
router.delete('/deletarDisciplina/:disciplinaId', DisciplinaController.deletarDisciplina);

router.post('/vincularAlunoADisciplina', AlunoDisciplinaController.vincularAlunoADisciplina);
router.get('/listarDisciplinasDoAluno/:alunoId', AlunoDisciplinaController.listarDisciplinasDoAluno);

router.post('/cadastrarNota', NotaController.cadastrarNota);
router.get('/listarNotasDoAluno/:alunoId', NotaController.listarNotasDoAluno);
router.put('/atualizarNota/:id_nota', NotaController.atualizarNota);
router.delete('/deletarNota/:id_nota', NotaController.deletarNota);

router.post('/cadastrarPresenca', PresencaController.cadastrarPresenca);
router.get('/listarPresencasDoAluno/:alunoId', PresencaController.listarPresencasDoAluno);
router.put('/atualizarPresenca/:id_presenca', PresencaController.atualizarPresenca);
router.delete('/deletarPresenca/:id_presenca', PresencaController.deletarPresenca);

router.get('/listarNotasComMedia/:alunoId', autenticarTokenProfessor, AlunoController.listarNotasComMedia);
router.get('/percentualPresenca/:alunoId', autenticarTokenProfessor, AlunoController.presencaPercentual);
router.get('/listarAlunosReprovados/:alunoId', autenticarTokenProfessor, AlunoController.listarAlunosReprovados);

router.get('/alunosReprovados/:disciplinaId', autenticarTokenProfessor, DisciplinaController.alunosReprovados);


router.get('/gerar-token', LoginController.gerarToken)

router.post('/login', LoginController.fazerLogin);

router.get('/dashboard', autenticarTokenGeral, ApiController.ping); //mudar depois
export default router;
