import React from 'react';
import { Link } from 'react-router-dom';

const Paciente: React.FC = () => {
  return (
    <div>
      <h1>Página do Paciente</h1>
      <Link to="/">Voltar para Home</Link>
    </div>
  );
};

export default Paciente;