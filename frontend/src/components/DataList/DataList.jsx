import React from 'react';
import { FaChalkboardTeacher, FaUserGraduate, FaEnvelope, FaIdCard } from 'react-icons/fa';
import './DataList.css'; 

const DataList = ({ title, data, columns, onBack, type }) => {
  const Icon = type === 'professores' ? FaChalkboardTeacher : FaUserGraduate;
  
  return (
    <div className="data-list">
      <div className="list-header">
        <h2>{title}</h2>
        <button onClick={onBack} className="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Voltar
        </button>
      </div>
      
      {(!data || data.length === 0) ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Icon size={48} />
          </div>
          <p>Nenhum dado encontrado</p>
        </div>
      ) : (
        <div className="cards-container">
          {data.map((item, index) => (
            <div key={index} className="user-card">
              <div className="card-header">
                <div className="user-icon">
                  <Icon size={20} />
                </div>
                <h3>{item.nome}</h3>
              </div>
              
              <div className="card-details">
                <div className="detail-item">
                  <FaIdCard className="detail-icon" />
                  <span className="detail-label">
                    {type === 'professores' ? 'SIAPE:' : 'Matrícula:'}
                  </span>
                  <span className="detail-value">
                    {type === 'professores' ? item.siape : item.matricula}
                  </span>
                </div>
                
                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{item.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataList;