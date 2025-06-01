import React, { useState } from 'react';
import './SelectionModal.css'; // Certifique-se de ter um arquivo CSS para estilos

const SelectionModal = ({ 
  title, 
  options, 
  onSelect, 
  onCancel,
  isLoading,
  error
}) => {
  const [selectedId, setSelectedId] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="selection-container">
            <select 
              value={selectedId} 
              onChange={(e) => setSelectedId(e.target.value)}
              className="selection-input"
            >
              <option value="">Selecione...</option>
              {options.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <div className="modal-buttons">
              <button 
                onClick={() => onSelect(selectedId)} 
                disabled={!selectedId}
                className="confirm-btn"
              >
                Confirmar
              </button>
              <button onClick={onCancel} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionModal;