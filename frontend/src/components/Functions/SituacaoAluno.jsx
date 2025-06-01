import React from 'react';

const SituacaoAluno = ({ situacoes }) => {
  return (
    <div className="situacao-container">
      <h3>Situação do Aluno</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Média</th>
              <th>Presença</th>
              <th>Resultado (Nota)</th>
              <th>Resultado (Presença)</th>
            </tr>
          </thead>
          <tbody>
            {situacoes.map((situacao, index) => (
              <tr key={index}>
                <td>{situacao.disciplina}</td>
                <td>{situacao.media !== null ? situacao.media.toFixed(2) : 'N/A'}</td>
                <td>{situacao.mediaP !== null ? situacao.mediaP.toFixed(2) + '%' : 'N/A'}</td>
                <td className={situacao.resultMedia.includes('Reprovado') ? 'reprovado' : 'aprovado'}>
                  {situacao.resultMedia}
                </td>
                <td className={situacao.resultPresenca.includes('Reprovado') ? 'reprovado' : 'aprovado'}>
                  {situacao.resultPresenca}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SituacaoAluno;