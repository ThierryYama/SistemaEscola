import React from 'react';

const NotasAluno = ({ notas, medias }) => {
  return (
    <div className="notas-container">
      <h3>Notas</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Nota</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((nota, index) => (
              <tr key={index}>
                <td>{nota.Disciplina.nome}</td>
                <td>{nota.nota}</td>
                <td>{new Date(nota.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Médias por Disciplina</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Média</th>
            </tr>
          </thead>
          <tbody>
            {medias.map((media, index) => (
              <tr key={index}>
                <td>{media.Disciplina.nome}</td>
                <td>{parseFloat(media.media).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotasAluno;