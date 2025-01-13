import { useState } from 'react';
import Panel from '../../components/Panel';
import DataTable from '../../components/DataTable';
import { InputText } from '../../components/InputText';
import { Select } from '../../components/Select';
import './styles.css';

export interface Patient {
  id: number;
  name: string;
  cpf: string;
  gender: string;
}

const Patient = () => {
  const [newPatient, setNewPatient] = useState({
    name: '',
    cpf: '',
    gender: ''
  });

  const genders = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'O', label: 'Outro' }
  ];

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreatePatient = () => {
    // Implementação do handleCreatePatient
  };

  const handleDeletePatient = (id: number) => {
    // Implementação do handleDeletePatient
  };

  const handleEditPatient = (patient: Patient) => {
    // Implementação do handleEditPatient
  };

  // Exemplo de dados - substitua pela sua implementação real
  const patients = [
    { id: 1, name: 'João Silva', cpf: '123.456.789-00', gender: 'M' },
    { id: 2, name: 'Maria Santos', cpf: '987.654.321-00', gender: 'F' }
  ];

  const columns = [
    { field: 'name' as const, header: 'Nome' },
    { field: 'cpf' as const, header: 'CPF' },
    { 
      field: 'gender' as const, 
      header: 'Gênero',
      render: (patient: Patient) => {
        const gender = genders.find(g => g.value === patient.gender);
        return gender ? gender.label : patient.gender;
      }
    },
    {
      field: 'id' as const,
      header: 'Ações',
      render: (patient: Patient) => (
        <button onClick={() => handleDeletePatient(patient.id)} className="delete-button">
          Excluir
        </button>
      )
    }
  ];

  return (
    <div>
      <Panel title="Cadastro de Paciente">
        <div className="form-grid">
          <div className="col-4">
            <div className="form-group">
              <InputText
                type="text"
                name="name"
                placeholder="Nome"
                value={newPatient.name}
                label="Nome"
                onChange={handleUserInput}
              />
            </div>
          </div>

          <div className="col-4">
            <div className="form-group">
              <InputText
                type="text"
                name="cpf"
                placeholder="CPF"
                value={newPatient.cpf}
                label="CPF"
                onChange={handleUserInput}
              />
            </div>
          </div>

          <div className="col-4">
            <div className="form-group">
              <Select
                name="gender"
                label="Gênero"
                value={newPatient.gender}
                onChange={handleUserInput}
                options={genders}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={handleCreatePatient}>
              Adicionar Paciente
            </button>
          </div>
        </div>
      </Panel>

      <Panel title="Lista de Pacientes">
        <DataTable 
          data={patients}
          columns={columns}
          title="Pacientes Cadastrados"
          showEditButton={true}
          onEdit={handleEditPatient}
        />
      </Panel>
    </div>
  );
};

export default Patient;
