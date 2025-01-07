import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Página Inicial</h1>
      <Link to="/paciente">Ir para a Página do Paciente</Link>
    </div>
  );
};

export default Home;