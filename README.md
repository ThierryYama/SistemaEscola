# 🧑‍🏫 Projeto: Sistema de Autenticação e Controle Acadêmico

## 🌟 Objetivo

Implementar um sistema completo de autenticação e controle de acesso para professores e alunos, com:

* Login com senha protegida por **bcrypt**
* Emissão de **token JWT**
* **Middleware** para proteger rotas
* CRUD completo de professores e alunos
* Frontend simples para login e dashboard

---

## 1. 🛠️ Backend (Node.js + Express)

### 🧹 Funcionalidades Intermediárias (Somente Professores)

* `GET /alunos/:id/notas`
* `GET /alunos/:id/presencas`
* `GET /disciplinas/:id/reprovados`
* `GET /alunos/:id/situacao`

---

## 2. 🖥️ Frontend (React + Vite)

### 🔓 Página de Login
### ✅ Dashboard

---

## 🤮 Testes Automatizados (Jest + Supertest)

---

## 📁 Como Rodar o Projeto

```bash
# Clone o repositório
git clone <url do repositorio>
cd <pasta>

# Instale dependências
cd .\frontend\
npm install

cd .\backend\
npm install

# Rode a aplicação
Frontend: npm run dev
Backend: npm run start-dev

```

## 🔹 Popular o Banco de Dados (Exemplo)

Para popular o banco é necessário cria-lo com o script sql disponibilizado no repositorio.

Para cadastrar alunos é necessário ir na rota: POST /cadastrarAluno
E passar o json no formato:

{

"nome": "nome do aluno",
"email": "email do aluno",
"senha": "senha do aluno",
"matricula": "matricula do aluno",
"id_turma": "id da turma do aluno"

}

Para cadastrar Professores é necessario ir na rota: POST /cadastrarProfessor
E passar o json no formato: 

{

"nome": "nome do professor",
"email": "email do professor",
"senha": "senha do professor",
"siape": "siape do professor"

}

Senha já criptografada com bcrypt

---

## 📈 Observações

* Certifique-se de que as rotas protegidas estão usando o middleware corretamente.
* O frontend deve armazenar e usar o token JWT nas chamadas.
* O projeto é compatível com qualquer frontend moderno.
---
