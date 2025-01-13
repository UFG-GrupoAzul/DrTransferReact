import { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import DataTable from '../../components/DataTable';
import { InputText } from '../../components/InputText';
import { Select } from '../../components/Select';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Toast, ToastMessage } from '../../components/Toast';
import patientService, { Patient } from '../../services/patientService';
import enumService, { EnumItem } from '../../services/enumService';
import './styles.css';

const PatientPage = () => {
  const [list, setList] = useState<Patient[]>([]);
  const [item, setItem] = useState({
    name: '',
    birthDate: '',
    cpf: '',
    gender: '',
    phone: '',
    bloodType: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null as number | null,
    name: ''
  });
  const [genders, setGenders] = useState<EnumItem[]>([]);
  const [bloodTypes, setBloodTypes] = useState<EnumItem[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    loadData();
    loadGenders();
    loadBloodTypes();
  }, []);

  const showToast = (message: ToastMessage) => {
    setToast(message);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const loadData = async () => {
    try {
      const data = await patientService.getAll();
      setList(data);
    } catch (error) {
      showToast({
        severity: 'error',
        summary: 'Erro ao carregar dados',
        detail: 'Não foi possível carregar a lista de pacientes.'
      });
    }
  };

  const loadGenders = async () => {
    try {
      const data = await enumService.getGenders();
      setGenders(data);
    } catch (error) {
      showToast({
        severity: 'error',
        summary: 'Erro ao carregar gêneros',
        detail: 'Não foi possível carregar a lista de gêneros.'
      });
    }
  };

  const loadBloodTypes = async () => {
    try {
      const data = await enumService.getBloodTypes();
      setBloodTypes(data);
    } catch (error) {
      showToast({
        severity: 'error',
        summary: 'Erro ao carregar tipos sanguíneos',
        detail: 'Não foi possível carregar a lista de tipos sanguíneos.'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!item.name?.trim()) {
      errors.push('Nome é obrigatório');
    }
    if (!item.birthDate) {
      errors.push('Data de Nascimento é obrigatória');
    }
    if (!item.cpf?.trim()) {
      errors.push('CPF é obrigatório');
    }
    if (!item.gender) {
      errors.push('Gênero é obrigatório');
    }
    if (!item.bloodType) {
      errors.push('Tipo Sanguíneo é obrigatório');
    }

    if (errors.length > 0) {
      showToast({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: errors.join('\n')
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && editingId) {
        await patientService.update(editingId, item);
        showToast({
          severity: 'success',
          summary: 'Paciente atualizado',
          detail: 'O paciente foi atualizado com sucesso.'
        });
      } else {
        await patientService.create(item);
        showToast({
          severity: 'success',
          summary: 'Paciente cadastrado',
          detail: 'O paciente foi cadastrado com sucesso.'
        });
      }
      
      await loadData();
      resetForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao salvar paciente';
      showToast({
        severity: 'error',
        summary: 'Erro ao salvar',
        detail: errorMessage
      });
    }
  };

  const handleEdit = (data: Patient) => {
    setItem({
      name: data.person.name,
      birthDate: data.birthDate.split('T')[0],
      cpf: data.person.cpf,
      gender: data.person.gender,
      phone: data.person.phone || '',
      bloodType: data.bloodType
    });
    setIsEditing(true);
    setEditingId(data.id);
  };

  const handleDeleteClick = (data: Patient) => {
    setConfirmDialog({
      isOpen: true,
      id: data.id,
      name: data.person.name
    });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.id) {
      try {
        await patientService.delete(confirmDialog.id);
        await loadData();
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
    setConfirmDialog({ isOpen: false, id: null, name: '' });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, id: null, name: '' });
  };

  const resetForm = () => {
    setItem({
      name: '',
      birthDate: '',
      cpf: '',
      gender: '',
      phone: '',
      bloodType: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const columns = [
    { 
      field: 'person' as const, 
      header: 'Nome',
      render: (data: Patient) => data.person.name
    },
    { 
      field: 'person' as const, 
      header: 'CPF',
      render: (data: Patient) => data.person.cpf
    },
    { 
      field: 'birthDate' as const, 
      header: 'Data de Nascimento',
      render: (data: Patient) => formatDate(data.birthDate)
    },
    { 
      field: 'person' as const, 
      header: 'Gênero',
      render: (data: Patient) => {
        const gender = genders.find(g => g.value === data.person.gender);
        return gender ? gender.label : data.person.gender;
      }
    },
    { 
      field: 'person' as const, 
      header: 'Telefone',
      render: (data: Patient) => data.person.phone || '-'
    },
    { 
      field: 'bloodType' as const, 
      header: 'Tipo Sanguíneo',
      render: (data: Patient) => {
        const bloodType = bloodTypes.find(bt => bt.value === data.bloodType);
        return bloodType ? bloodType.label : data.bloodType;
      }
    },
    {
      field: 'id' as const,
      header: 'Ações',
      render: (data: Patient) => (
        <button 
          onClick={() => handleDeleteClick(data)} 
          className="delete-button"
        >
          Excluir
        </button>
      )
    }
  ];

  return (
    <div>
      <Toast message={toast} onClose={() => setToast(null)} />
      <Panel title={isEditing ? "Editar Paciente" : "Cadastro de Paciente"}>
        <div className="form-grid">
          <div className="col-4">
            <div className="form-group">
              <InputText
                type="text"
                name="name"
                placeholder="Nome do Paciente"
                value={item.name}
                label="Nome"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-4">
            <div className="form-group">
              <InputText
                type="date"
                name="birthDate"
                value={item.birthDate}
                label="Data de Nascimento"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-4">
            <div className="form-group">
              <InputText
                type="text"
                name="cpf"
                placeholder="CPF"
                value={item.cpf}
                label="CPF"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-4">
            <div className="form-group">
              <Select
                name="gender"
                label="Gênero"
                value={item.gender}
                onChange={handleInputChange}
                options={genders}
                placeholder="Selecione o gênero"
              />
            </div>
          </div>

          <div className="col-4">
            <div className="form-group">
              <InputText
                type="tel"
                name="phone"
                placeholder="Telefone"
                value={item.phone}
                label="Telefone"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-4">
            <div className="form-group">
              <Select
                name="bloodType"
                label="Tipo Sanguíneo"
                value={item.bloodType}
                onChange={handleInputChange}
                options={bloodTypes}
                placeholder="Selecione o tipo sanguíneo"
              />
            </div>
          </div>

          <div className="form-actions">
            {isEditing && (
              <button className="btn-secondary" onClick={resetForm}>
                Cancelar
              </button>
            )}
            <button className="btn-primary" onClick={handleSubmit}>
              {isEditing ? 'Atualizar' : 'Adicionar'} Paciente
            </button>
          </div>
        </div>
      </Panel>

      <DataTable 
        data={list}
        columns={columns}
        title="Pacientes Cadastrados"
        showEditButton={true}
        onEdit={handleEdit}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir o paciente {itemName}?"
        itemName={confirmDialog.name}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default PatientPage;