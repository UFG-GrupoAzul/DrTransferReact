import { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import DataTable from '../../components/DataTable';
import { InputText } from '../../components/InputText';
import { Select } from '../../components/Select';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Toast, ToastMessage } from '../../components/Toast';
import regulatoryDoctorService, { RegulatoryDoctor, RegulatoryDoctorInput } from '../../services/regulatoryDoctorService';
import enumService, { EnumItem } from '../../services/enumService';
import './styles.css';

const RegulatoryDoctorPage = () => {
    const [list, setList] = useState<RegulatoryDoctor[]>([]);
    const [item, setItem] = useState<RegulatoryDoctorInput>({
        name: '',
        cpf: '',
        phone: '',
        crm: '',
        insurance: '',
        gender: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [genders, setGenders] = useState<EnumItem[]>([]);
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        id: null as string | null,
        name: ''
    });

    useEffect(() => {
        loadData();
        loadGenders();
    }, []);

    const showToast = (message: ToastMessage) => {
        setToast(message);
    };

    const loadData = async () => {
        try {
            const data = await regulatoryDoctorService.getAll();
            setList(data);
        } catch (error) {
            showToast({
                severity: 'error',
                summary: 'Erro ao carregar dados',
                detail: 'Não foi possível carregar a lista de médicos reguladores.'
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
        if (!item.insurance?.trim()) {
            errors.push('Convênio é obrigatório');
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
            if (editingId) {
                await regulatoryDoctorService.updateRegulatoryDoctor(editingId, item);
                showToast({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Médico regulador atualizado com sucesso!'
                });
            } else {
                await regulatoryDoctorService.createRegulatoryDoctor(item);
                showToast({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Médico regulador cadastrado com sucesso!'
                });
            }

            await loadData();
            resetForm();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao salvar médico regulador';
            showToast({
                severity: 'error',
                summary: 'Erro',
                detail: message
            });
        }
    };

    const handleEdit = (data: RegulatoryDoctor) => {
        setItem({
            name: data.name,
            cpf: data.cpf,
            phone: data.phone || '',
            crm: data.crm,
            insurance: data.insurance,
            gender: data.gender
        });
        setIsEditing(true);
        setEditingId(data.id);
    };

    const handleDeleteClick = (data: RegulatoryDoctor) => {
        setConfirmDialog({
            isOpen: true,
            id: data.id,
            name: data.name
        });
    };

    const handleConfirmDelete = async () => {
        if (confirmDialog.id) {
            try {
                await regulatoryDoctorService.delete(confirmDialog.id);
                showToast({
                    severity: 'success',
                    summary: 'Médico regulador excluído',
                    detail: 'O médico regulador foi excluído com sucesso.'
                });
                await loadData();
            } catch (error) {
                showToast({
                    severity: 'error',
                    summary: 'Erro ao excluir',
                    detail: 'Não foi possível excluir o médico regulador.'
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
            phone: '',
            crm: '',
            insurance: '',
            gender: ''
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const columns = [
        { field: 'name' as keyof RegulatoryDoctor, header: 'Nome' },
        { field: 'cpf' as keyof RegulatoryDoctor, header: 'CPF' },
        { field: 'crm' as keyof RegulatoryDoctor, header: 'CRM' },
        { field: 'insurance' as keyof RegulatoryDoctor, header: 'Convênio' },
        {
            field: 'gender' as keyof RegulatoryDoctor,
            header: 'Gênero',
            render: (data: RegulatoryDoctor) => {
                const gender = genders.find(g => g.value === data.gender);
                return gender ? gender.label : data.gender;
            }
        },
        { field: 'phone' as keyof RegulatoryDoctor, header: 'Telefone' }
    ];

    return (
        <div>
            <Panel title="Cadastro de Médico Regulador">
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
                            label="Convênio"
                            name="insurance"
                            value={item.insurance}
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
                title="Lista de Médicos Reguladores"
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
                message={`Deseja realmente excluir o médico regulador ${confirmDialog.name}?`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            <Toast message={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default RegulatoryDoctorPage; 