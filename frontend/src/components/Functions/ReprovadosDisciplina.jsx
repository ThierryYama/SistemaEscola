import React from 'react';

const ReprovadosDisciplina = ({ reprovados, disciplinaNome }) => {
  return (
    <div className="reprovados-container">
      <h3>Alunos Reprovados em {disciplinaNome}</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Média</th>
              <th>Percentual de Presença</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {reprovados.map((aluno, index) => (
              <tr key={index}>
                <td>{aluno.nome}</td>
                <td>{aluno.media !== null ? aluno.media.toFixed(2) : 'N/A'}</td>
                <td>{aluno.percentualPresenca !== null ? aluno.percentualPresenca.toFixed(2) + '%' : 'N/A'}</td>
                <td>
                  {aluno.resultMedia === "Reprovado (nota)" && aluno.resultPresenca === "Reprovado (presença)" 
                    ? "Nota e Presença" 
                    : aluno.resultMedia === "Reprovado (nota)" 
                      ? "Nota" 
                      : "Presença"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReprovadosDisciplina;