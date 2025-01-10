import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPatient, deletePatient, getPatients } from '../../services/patientService';
import { Options , Select} from '../../components/Select';
import {InputText} from '../../components/InputText'


//Interface pra definir o que tem nessa entidade
interface Patient {
  id: string;
  person: {
    name: string;
    cpf: string;
    gender: string;

  };
}
const Paciente = () => {

  const genders: Options[] = [{
    value: '',
    label: 'Selecione uma opção.'

  },
  {
    value: 'FEMALE',
    label: 'Feminino'
  }, {
    value: 'MALE',
    label: 'Masculino'
  }]


  //atualizar lista após modificação
  const updateScreen = async () => {
    const updatedPatients = await getPatients();
    setPatients(updatedPatients);
  }


  //Estado p/ receber do GET [variável de estado, Função atualizadora da variável
  const [patients, setPatients] = useState<Patient[]>([]); //useState inicializa com array vazio


  //Estado p/ guardar input do user no form [objeto novoPaciente, método atualizador do objeto]  
  const [newPatient, setNewPatient] = useState({
    name: '',
    cpf: '',
    gender: '',
    bloodType: 'O_POSITIVE', // mock
    phone: '99999',// mock
    birthDate: '1999-09-09'// mock

  })

  //chamando API GET
  useEffect(() => { // useEffect para chamadas automáticas
    const fetchPatients = async () => {
      //chama getPatients do service
      const data = await getPatients();
      setPatients(data); //setPatients atualizando patients
    };

    fetchPatients(); //chamando a função 
  }, []); //array vazio é como faz isso ser carregado apenas uma vez (quando chama o componente)


  //POST
  /*Função pra atualizar o estado conforme input
  evento captura mudanças no input ou no select
  extrai os valores dessa entrada do user e atualiza o estado copiando os valores existentes
  Não usa useEffect porque é disparada por evento*/
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
    updateScreen();
  }

  //DELETE
  const handleDeletePatient = async (id: string) => {
    await deletePatient(id) //chama deleção do service
    updateScreen();
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
            <span>
              Nome: {patient.person.name} - CPF: {patient.person.cpf} - Gênero:{genders.find((gender) => gender.value === patient.person.gender)?.label || 'Gênero desconhecido'}
            </span>
            <button onClick={() => handleDeletePatient(patient.id)}>Remover</button>
            <br></br>

          </li>
        ))}


      </ul>

      <div>
        <h3>Adicionar Paciente</h3>
        <InputText
          type="text"
          name="name"
          placeholder="Nome"
          value={newPatient.name}
          label = "Nome"
          onChange={handleUserInput}
        />

        <InputText
          type="text"
          name="cpf"
          placeholder="CPF"
          value={newPatient.cpf} 
          label="CPF"
          onChange={handleUserInput} 
        />
    
        <Select
          name="gender"
          label="Gênero"
          value={newPatient.gender}
          onChange={handleUserInput}
          options={genders}
        />


        <button onClick={handleCreatePatient}>Adicionar Paciente</button>
      </div>
    </div>
  );
};

export default Paciente;
