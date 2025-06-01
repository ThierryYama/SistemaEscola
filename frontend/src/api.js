import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const fetchProfessores = async () => {
  try {
    const response = await api.get('/listarProfessores');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar professores: ' + error.message);
  }
};

export const fetchAlunos = async () => {
  try {
    const response = await api.get('/listarAlunos');
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar alunos: ' + error.message);
  }
};

export const fetchNotasAluno = async (alunoId) => {
  const response = await api.get(`/listarNotasComMedia/${alunoId}`);
  return response.data;
};

export const fetchPresencasAluno = async (alunoId) => {
  const response = await api.get(`/percentualPresenca/${alunoId}`);
  return response.data;
};

export const fetchReprovadosDisciplina = async (disciplinaId) => {
  const response = await api.get(`/alunosReprovados/${disciplinaId}`);
  return response.data;
};

export const fetchSituacaoAluno = async (alunoId) => {
  const response = await api.get(`/listarAlunosReprovados/${alunoId}`);
  return response.data;
};

export default api;