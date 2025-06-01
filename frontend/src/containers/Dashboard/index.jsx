import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchProfessores, 
  fetchAlunos, 
  fetchNotasAluno, 
  fetchPresencasAluno, 
  fetchReprovadosDisciplina,
  fetchSituacaoAluno
} from '../../api';
import DataList from '../../components/DataList/DataList';
import SelectionModal from '../../components/SelectionModal/SelectionModal';
import NotasAluno from '../../components/Functions/NotasAluno';
import PresencasAluno from '../../components/Functions/PresencasAluno';
import SituacaoAluno from '../../components/Functions/SituacaoAluno';
import ReprovadosDisciplina from '../../components/Functions/ReprovadosDisciplina';
import './styles.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [view, setView] = useState('main');
  const [viewTitle, setViewTitle] = useState('');
  const [viewContent, setViewContent] = useState(null);
  
  const [showAlunoSelection, setShowAlunoSelection] = useState(false);
  const [showDisciplinaSelection, setShowDisciplinaSelection] = useState(false);
  const [currentAction, setCurrentAction] = useState('');
  const [alunosList, setAlunosList] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [disciplinasList] = useState([
    { id: '1', nome: 'oo' },
    { id: '2', nome: 'backend' },

  ]);

  const professorColumns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'SIAPE', accessor: 'siape' },
    { header: 'Email', accessor: 'email' },
  ];

  const alunoColumns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Matrícula', accessor: 'matricula' },
    { header: 'Email', accessor: 'email' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const type = localStorage.getItem('userType');
    
    if (!token) {
      navigate('/');
      return;
    }
    
    setUserName(name || 'Usuário');
    setUserType(type || 'aluno');
    
    if (type === 'professor') {
      fetchAlunosList();
    }
  }, [navigate]);

  const fetchAlunosList = async () => {
    try {
      const alunos = await fetchAlunos();
      setAlunosList(alunos.map(aluno => ({
        id: aluno.id,
        label: `${aluno.nome} (${aluno.matricula})`
      })));
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const handleVerProfessores = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProfessores();
      setProfessores(data);
      setView('professores');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerAlunos = async () => {
    if (userType !== 'professor') {
      alert('Acesso negado');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await fetchAlunos();
      setAlunos(data);
      setView('alunos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAlunoSelection = (action) => {
    setCurrentAction(action);
    setShowAlunoSelection(true);
  };

  const openDisciplinaSelection = (action) => {
    setCurrentAction(action);
    setShowDisciplinaSelection(true);
  };

  const handleAlunoSelected = async (alunoId) => {
    setShowAlunoSelection(false);
    if (!alunoId) return;
    
    setLoading(true);
    setError('');
    
    try {
      let content;
      let title = '';
      
      switch (currentAction) {
        case 'notas':
          const notasData = await fetchNotasAluno(alunoId);
          title = `Notas do Aluno`;
          content = <NotasAluno notas={notasData.notas} medias={notasData.medias} />;
          break;
          
        case 'presencas':
          const presencasData = await fetchPresencasAluno(alunoId);
          title = `Presenças do Aluno`;
          content = <PresencasAluno presencas={presencasData.presencas} />;
          break;
          
        case 'situacao':
          const situacaoData = await fetchSituacaoAluno(alunoId);
          title = `Situação do Aluno`;
          content = <SituacaoAluno situacoes={situacaoData} />;
          break;
          
        default:
          return;
      }
      
      setViewTitle(title);
      setViewContent(content);
      setView('details');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisciplinaSelected = async (disciplinaId) => {
    setShowDisciplinaSelection(false);
    if (!disciplinaId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const disciplina = disciplinasList.find(d => d.id === disciplinaId);
      const reprovados = await fetchReprovadosDisciplina(disciplinaId);
      
      setViewTitle(`Reprovados em ${disciplina.nome}`);
      setViewContent(<ReprovadosDisciplina 
        reprovados={reprovados} 
        disciplinaNome={disciplina.nome} 
      />);
      setView('details');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToMain = () => {
    setView('main');
    setViewContent(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Bem-vindo, {userType === 'professor' ? 'Professor' : 'Aluno'} {userName}</span>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      )}

      {view === 'main' && (
        <div className="dashboard-actions">
          <h2>Funcionalidades</h2>
          <div className="actions-grid">
            <button className="action-btn" onClick={handleVerProfessores}>
              Ver Professores
            </button>

            {userType === 'professor' && (
              <>
                <button className="action-btn" onClick={handleVerAlunos}>
                  Ver Alunos
                </button>
                <button className="action-btn" onClick={() => openAlunoSelection('notas')}>
                  Notas do Aluno
                </button>
                <button className="action-btn" onClick={() => openAlunoSelection('presencas')}>
                  Presenças do Aluno
                </button>
                <button className="action-btn" onClick={() => openDisciplinaSelection('reprovados')}>
                  Reprovados na Disciplina
                </button>
                <button className="action-btn" onClick={() => openAlunoSelection('situacao')}>
                  Situação do Aluno
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {view === 'list' && (
        <DataList
          title={viewTitle}
          data={viewData}
          onBack={handleBackToMain}
          type={viewTitle.includes('Professores') ? 'professores' : 'alunos'}
        />
      )}

      {view === 'professores' && (
        <DataList
          title="Lista de Professores"
          data={professores}
          columns={professorColumns}
          onBack={() => setView('main')}
          type="professores"
        />
      )}

      {view === 'alunos' && (
        <DataList
          title="Lista de Alunos"
          data={alunos}
          columns={alunoColumns}
          onBack={() => setView('main')}
          type="alunos"
        />
      )}

      {view === 'details' && (
        <div className="details-view">
          <h2>{viewTitle}</h2>
          {viewContent}
          <button onClick={handleBackToMain} className="back-btn">
            Voltar
          </button>
        </div>
      )}

      {showAlunoSelection && (
        <SelectionModal
          title="Selecione um Aluno"
          options={alunosList}
          onSelect={handleAlunoSelected}
          onCancel={() => setShowAlunoSelection(false)}
        />
      )}

      {showDisciplinaSelection && (
        <SelectionModal
          title="Selecione uma Disciplina"
          options={disciplinasList.map(d => ({ id: d.id, label: d.nome }))}
          onSelect={handleDisciplinaSelected}
          onCancel={() => setShowDisciplinaSelection(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;