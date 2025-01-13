import { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import DataTable from '../../components/DataTable';
import { InputText } from '../../components/InputText';
import ConfirmDialog from '../../components/ConfirmDialog';
import specialtyService, { Specialty } from '../../services/specialtyService';
import './styles.css';

const SpecialtyPage = () => {
  const [list, setList] = useState<Specialty[]>([]);
  const [item, setItem] = useState({
    name: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: null as number | null,
    name: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await specialtyService.getAll();
      setList(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing && editingId) {
        await specialtyService.update(editingId, item);
      } else {
        await specialtyService.create(item);
      }
      
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleEdit = (data: Specialty) => {
    setItem({
      name: data.name,
      description: data.description
    });
    setIsEditing(true);
    setEditingId(data.id);
  };

  const handleDeleteClick = (data: Specialty) => {
    setConfirmDialog({
      isOpen: true,
      id: data.id,
      name: data.name
    });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.id) {
      try {
        await specialtyService.delete(confirmDialog.id);
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
      render: (data: Specialty) => (
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
      <Panel title={isEditing ? "Editar Especialidade" : "Cadastro de Especialidade"}>
        <div className="form-grid">
          <div className="col-6">
            <div className="form-group">
              <InputText
                type="text"
                name="name"
                placeholder="Nome da Especialidade"
                value={item.name}
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
                value={item.description}
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
        data={list}
        columns={columns}
        title="Especialidades Cadastradas"
        showEditButton={true}
        onEdit={handleEdit}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir a especialidade {itemName}?"
        itemName={confirmDialog.name}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default SpecialtyPage; 