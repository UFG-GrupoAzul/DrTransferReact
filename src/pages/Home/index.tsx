import { Link } from 'react-router-dom';
import Paciente from '../Paciente'

function Home() {
  return (
    <div>
      <h1>Bem-vindo à Página Inicial</h1>
      <Link to= './paciente'>Ir para Pacientes</Link>
    </div>
  );
}

export default Home;