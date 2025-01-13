import { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import DataTable from '../../components/DataTable';
import { InputText } from '../../components/InputText';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Specialty, getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty } from '../../services/specialtyService';
import './styles.css';

const SpecialtyPage = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [newSpecialty, setNewSpecialty] = useState({
    name: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    specialtyId: null as number | null,
    specialtyName: ''
  });

  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    try {
      const data = await getSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error('Erro ao carregar especialidades:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSpecialty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && editingId) {
        await updateSpecialty(editingId, newSpecialty);
      } else {
        await createSpecialty(newSpecialty);
      }
      
      await loadSpecialties();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar especialidade:', error);
    }
  };

  const handleEdit = (specialty: Specialty) => {
    setNewSpecialty({
      name: specialty.name,
      description: specialty.description
    });
    setIsEditing(true);
    setEditingId(specialty.id);
  };

  const handleDeleteClick = (specialty: Specialty) => {
    setConfirmDialog({
      isOpen: true,
      specialtyId: specialty.id,
      specialtyName: specialty.name
    });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.specialtyId) {
      try {
        await deleteSpecialty(confirmDialog.specialtyId);
        await loadSpecialties();
      } catch (error) {
        console.error('Erro ao excluir especialidade:', error);
      }
    }
    setConfirmDialog({ isOpen: false, specialtyId: null, specialtyName: '' });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, specialtyId: null, specialtyName: '' });
  };

  const resetForm = () => {
    setNewSpecialty({
      name: '',
      description: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const columns = [
    { field: 'name' as const, header: 'Nome' },
    { field: 'description' as const, header: 'Descrição' },
    {
      field: 'id' as const,
      header: 'Ações',
      render: (specialty: Specialty) => (
        <button 
          onClick={() => handleDeleteClick(specialty)} 
          className="delete-button"
        >
          Excluir
        </button>
      )
    }
  ];

  return (
    <div>
      <Panel title={isEditing ? "Editar Especialidade" : "Cadastro de Especialidade"}>
        <div className="form-grid">
          <div className="col-6">
            <div className="form-group">
              <InputText
                type="text"
                name="name"
                placeholder="Nome da Especialidade"
                value={newSpecialty.name}
                label="Nome"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-6">
            <div className="form-group">
              <InputText
                type="text"
                name="description"
                placeholder="Descrição"
                value={newSpecialty.description}
                label="Descrição"
                onChange={handleInputChange}
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
              {isEditing ? 'Atualizar' : 'Adicionar'} Especialidade
            </button>
          </div>
        </div>
      </Panel>

      <DataTable 
        data={specialties}
        columns={columns}
        title="Especialidades Cadastradas"
        showEditButton={true}
        onEdit={handleEdit}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir a especialidade {itemName}?"
        itemName={confirmDialog.specialtyName}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default SpecialtyPage; 