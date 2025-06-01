import {Aluno} from './Aluno';
import {Turma} from './Turma';
import {Disciplina} from './Disciplina';
import { AlunoDisciplina } from "./AlunoDisciplina";
import { Professor } from './Professor';
import { Curso } from './Curso';
import {Nota} from './Nota';
import { Presenca } from './Presenca';


Aluno.belongsTo(Turma, {
    foreignKey: "id_turma",
});

Disciplina.belongsTo(Professor, {
    foreignKey: "id_professor",
});

Turma.belongsTo(Curso, {
    foreignKey: "id_curso",
});

Nota.belongsTo(Aluno, {
    foreignKey: "alunoId",
});

Nota.belongsTo(Disciplina, {
    foreignKey: "disciplinaId",
});

Presenca.belongsTo(Aluno, {
    foreignKey: "alunoId",
});

Presenca.belongsTo(Disciplina, {
    foreignKey: "disciplinaId",
});


Aluno.hasMany(Nota, {
    foreignKey: "alunoId",
});

Aluno.hasMany(Presenca, {
    foreignKey: "alunoId",
});

Disciplina.hasMany(Nota, {
    foreignKey: "disciplinaId",
});

Disciplina.hasMany(Presenca, {
    foreignKey: "disciplinaId",
});

Curso.hasMany(Turma, {
    foreignKey: "id_curso",
});

Turma.hasMany(Aluno, { 
    foreignKey: 'id_turma' 
});


Aluno.belongsToMany(Disciplina,{
    through: AlunoDisciplina,
    foreignKey: "alunoId"
});

Disciplina.belongsToMany(Aluno,{
    through: AlunoDisciplina,
    foreignKey: "disciplinaId"
});

console.log("Relações entre models configurada.")