import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPatient, getPatients } from '../../services/patientService';


//Interface pra definir o que tem nessa entidade
interface Patient {
  id: string;
  person: {
    name: string;
    cpf: string;
    gender: string;
  };
}
const Paciente: React.FC = () => {

  //Estado p/ receber do GET [variável de estado, método atualizador da variável]
  const [patients, setPatients] = useState<Patient[]>([]); //useState inicializa com array vazio


  //Estado p/ guardar input do user no form [objeto novoPaciente, método atualizador do objeto]  
  const [newPatient, setNewPatient] = useState({
    name: '',
    cpf: '',
    gender: '',
  })

  //chamando API GET
  useEffect(() => {
    const fetchPatients = async () => {
      //chama getPatients do service
      const data = await getPatients();
      setPatients(data); //setPatients atualizando patients
    };

    fetchPatients(); //chamando a função 
  }, []); //array vazio é como faz isso ser carregado apenas uma vez (quando chama o componente)


  //POST
  /*Método pra atualizar o estado conforme input
  evento captura mudanças no input ou no select
  extrai os valores dessa entrada do user e atualiza o estado copiando os valores existentes*/
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    /*const name = e.target.name;
    const value = e.target.value;*/
    setNewPatient({ ...newPatient, [name]: value });
  }

  //POST
  //Função p/ enviar dados 
  const handleCreatePatient = async () => {
    await createPatient(newPatient) //envia pro back
    const updatedPatients = await getPatients(); //atualiza lista (novo get)
    setPatients(updatedPatients);
  }

  //Render abaixo
  return (
    <div>
      <h1>Página do Paciente</h1>
      <Link to="/">Voltar para Home</Link>


      {/* Exibição da lista de Pacientes */}
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

      <div>
        <h3>Adicionar Paciente</h3>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={newPatient.name}
          onChange={handleUserInput}
        />
        <input
          type="text"
          name="cpf"
          placeholder="CPF"
          value={newPatient.cpf} // Valor atual do campo "cpf" no estado
          onChange={handleUserInput} // Atualiza o estado quando o usuário digita
        />
        <select
          name="gender"
          value={newPatient.gender} // Valor atual do campo "gender" no estado
          onChange={handleUserInput} // Atualiza o estado quando o usuário seleciona uma opção
        >
          <option value="">Selecione o gênero</option>
          <option value="MALE">Masculino</option>
          <option value="FEMALE">Feminino</option>
        </select>
        <button onClick={handleCreatePatient}>Adicionar Paciente</button>
      </div>
    </div>
  );
};

export default Paciente;
