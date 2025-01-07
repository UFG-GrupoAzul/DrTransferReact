import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatients } from '../../services/patientService';



interface Patient {
  id: string;
  person: {
    name: string;
    cpf: string; 
    gender: string;
  };
}
const Paciente: React.FC = () => {
  //patients é a variável de estado, recebe a lista do get
  //setPatients é atualiza patients
  //useState inicializa com vetor vazio
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      //chama getPatients do service
      const data = await getPatients();
      setPatients(data); //setPatients atualizando patients
    };

    fetchPatients(); //chamando a função 
  }, []); 


  //Render abaixo
  return (
    <div>
      <h1>Página do Paciente</h1>
      <Link to="/">Voltar para Home</Link>

      <h2>Pacientes:</h2>
    <ul>
      {patients.map((patient) => (
        <li key={patient.id}>
          Nome: {patient.person.name} 
         <li>CPF: {patient.person.cpf} </li> 
          <li>Gênero: {patient.person.gender}</li>

        </li>
      ))}
    </ul>
  </div>
  );
};

export default Paciente;
