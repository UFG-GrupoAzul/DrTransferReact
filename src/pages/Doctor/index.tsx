import { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import DataTable from '../../components/DataTable';
import { InputText } from '../../components/InputText';
import { Select } from '../../components/Select';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Toast, ToastMessage } from '../../components/Toast';
import doctorService, { Doctor, DoctorInput } from '../../services/doctorService';
import enumService, { EnumItem } from '../../services/enumService';
import './styles.css';

const DoctorPage = () => {
  const [list, setList] = useState<Doctor[]>([]);
  const [item, setItem] = useState<DoctorInput>({
    name: '',
    cpf: '',
    gender: '',
    phone: '',
    crm: '',
    registration: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null as string | null,
    name: ''
  });
  const [genders, setGenders] = useState<EnumItem[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    loadData();
    loadGenders();
  }, []);

  const showToast = (message: ToastMessage) => {
    setToast(message);
  };

  const loadData = async () => {
    try {
      const data = await doctorService.getAll();
      setList(data);
    } catch (error) {
      showToast({
        severity: 'error',
        summary: 'Erro ao carregar dados',
        detail: 'Não foi possível carregar a lista de médicos.'
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
    if (!item.cpf?.trim()) {
      errors.push('CPF é obrigatório');
    }
    if (!item.gender) {
      errors.push('Gênero é obrigatório');
    }
    if (!item.crm?.trim()) {
      errors.push('CRM é obrigatório');
    }
    if (!item.registration?.trim()) {
      errors.push('Matrícula é obrigatória');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const doctorData = {
        name: item.name,
        cpf: item.cpf,
        phone: item.phone,
        registration: item.registration,
        crm: item.crm,
        gender: item.gender
      };

      if (editingId) {
        await doctorService.updateDoctor(editingId, doctorData);
        showToast({ severity: 'success', summary: 'Sucesso', detail: 'Médico atualizado com sucesso!' });
      } else {
        await doctorService.createDoctor(doctorData);
        showToast({ severity: 'success', summary: 'Sucesso', detail: 'Médico cadastrado com sucesso!' });
      }

      await loadData();
      resetForm();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar médico';
      showToast({ severity: 'error', summary: 'Erro', detail: message });
    }
  };

  const handleEdit = (data: Doctor) => {
    setItem({
      name: data.name,
      cpf: data.cpf,
      gender: data.gender,
      phone: data.phone,
      crm: data.crm,
      registration: data.registration
    });
    setIsEditing(true);
    setEditingId(data.id);
  };

  const handleDeleteClick = (data: Doctor) => {
    setConfirmDialog({
      isOpen: true,
      id: data.id,
      name: data.name
    });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.id) {
      try {
        await doctorService.delete(confirmDialog.id);
        showToast({
          severity: 'success',
          summary: 'Médico excluído',
          detail: 'O médico foi excluído com sucesso.'
        });
        await loadData();
      } catch (error) {
        showToast({
          severity: 'error',
          summary: 'Erro ao excluir',
          detail: 'Não foi possível excluir o médico.'
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
      cpf: '',
      gender: '',
      phone: '',
      crm: '',
      registration: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const columns = [
    {
      field: 'name' as const,
      header: 'Nome',
      render: (data: Doctor) => data.name
    },
    {
      field: 'cpf' as const,
      header: 'CPF',
      render: (data: Doctor) => data.cpf
    },
    {
      field: 'gender' as const,
      header: 'Gênero',
      render: (data: Doctor) => {
        const gender = genders.find(g => g.value === data.gender);
        return gender ? gender.label : data.gender;
      }
    },
    {
      field: 'phone' as const,
      header: 'Telefone',
      render: (data: Doctor) => data.phone || '-'
    },
    {
      field: 'crm' as const,
      header: 'CRM'
    },
    {
      field: 'registration' as const,
      header: 'Matrícula'
    }
  ];

  return (
    <div className="doctor-page">
      <Panel title="Cadastro de Médicos">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="col-4">
            <InputText
              label="Nome"
              name="name"
              value={item.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-4">
            <InputText
              label="CPF"
              name="cpf"
              value={item.cpf}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-4">
            <Select
              label="Gênero"
              name="gender"
              value={item.gender}
              onChange={handleInputChange}
              options={genders}
            />
          </div>
          <div className="col-4">
            <InputText
              label="Telefone"
              name="phone"
              value={item.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-4">
            <InputText
              label="CRM"
              name="crm"
              value={item.crm}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-4">
            <InputText
              label="Matrícula"
              name="registration"
              value={item.registration}
              onChange={handleInputChange}
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
        title="Lista de Médicos"
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
        message={`Deseja realmente excluir o médico ${confirmDialog.name}?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default DoctorPage;
