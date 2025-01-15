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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null as string | null,
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
    const errors: string[] = [];

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
      name: data.name,
      birthDate: data.birthDate.split('T')[0],
      cpf: data.cpf,
      gender: data.gender,
      phone: data.phone || '',
      bloodType: data.bloodType
    });
    setIsEditing(true);
    setEditingId(data.id);
  };

  const handleDeleteClick = (data: Patient) => {
    setConfirmDialog({
      isOpen: true,
      id: data.id,
      name: data.name
    });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.id) {
      try {
        await patientService.delete(confirmDialog.id);
        showToast({
          severity: 'success',
          summary: 'Paciente excluído',
          detail: 'O paciente foi excluído com sucesso.'
        });
        await loadData();
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Erro ao excluir',
          detail: 'Não foi possível excluir o paciente.'
        });
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
      field: 'name' as keyof Patient,
      header: 'Nome'
    },
    {
      field: 'cpf' as keyof Patient,
      header: 'CPF'
    },
    {
      field: 'birthDate' as keyof Patient,
      header: 'Data de Nascimento',
      render: (data: Patient) => formatDate(data.birthDate)
    },
    {
      field: 'gender' as keyof Patient,
      header: 'Gênero',
      render: (data: Patient) => {
        const gender = genders.find(g => g.value === data.gender);
        return gender ? gender.label : data.gender;
      }
    },
    {
      field: 'phone' as keyof Patient,
      header: 'Telefone',
      render: (data: Patient) => data.phone || '-'
    },
    {
      field: 'bloodType' as keyof Patient,
      header: 'Tipo Sanguíneo',
      render: (data: Patient) => {
        const bloodType = bloodTypes.find(bt => bt.value === data.bloodType);
        return bloodType ? bloodType.label : data.bloodType;
      }
    }
  ];

  return (
    <div className="patient-page">
      <Panel title={isEditing ? "Editar Paciente" : "Cadastro de Paciente"}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="form-grid">
          <div className="col-4">
            <InputText
              label="Nome"
              name="name"
              value={item.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-4">
            <InputText
              type="date"
              label="Data de Nascimento"
              name="birthDate"
              value={item.birthDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-4">
            <InputText
              label="CPF"
              name="cpf"
              value={item.cpf}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-4">
            <Select
              label="Gênero"
              name="gender"
              value={item.gender}
              onChange={handleInputChange}
              options={genders}
              required
            />
          </div>

          <div className="col-4">
            <InputText
              type="tel"
              label="Telefone"
              name="phone"
              value={item.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-4">
            <Select
              label="Tipo Sanguíneo"
              name="bloodType"
              value={item.bloodType}
              onChange={handleInputChange}
              options={bloodTypes}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Panel>

      <DataTable
        title="Lista de Pacientes"
        data={list}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        showEditButton
        showDeleteButton
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmar exclusão"
        message={`Deseja realmente excluir o paciente ${confirmDialog.name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default PatientPage;