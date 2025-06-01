import React from 'react';

const PresencasAluno = ({ presencas }) => {
  return (
    <div className="presencas-container">
      <h3>Percentual de Presença por Disciplina</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Total de Aulas</th>
              <th>Presenças</th>
              <th>Percentual</th>
            </tr>
          </thead>
          <tbody>
            {presencas.map((presenca, index) => (
              <tr key={index}>
                <td>{presenca.Disciplina.nome}</td>
                <td>{presenca.totalAulas}</td>
                <td>{presenca.presencaTot}</td>
                <td>{parseFloat(presenca.percentualPresenca).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresencasAluno;