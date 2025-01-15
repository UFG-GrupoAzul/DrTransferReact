import { useEffect, useState } from 'react';
import { AutoCompleteSelect } from '../../components/AutoCompleteSelect';
import ConfirmDialog from '../../components/ConfirmDialog';
import DataTable from '../../components/DataTable';
import Panel from '../../components/Panel';
import { Select } from '../../components/Select';
import { Toast, ToastMessage } from '../../components/Toast';
import enumService, { EnumItem } from '../../services/enumService';
import patientService, { Patient } from '../../services/patientService';
import requestService, { Request, RequestInput } from '../../services/requestService';
import specialtyService, { Specialty } from '../../services/specialtyService';
import './styles.css';

const RequestPage = () => {
    const [list, setList] = useState<Request[]>([]);
    const [item, setItem] = useState<RequestInput>({
        patientId: '',
        specialtyId: '',
        classification: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [classifications, setClassifications] = useState<EnumItem[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        id: null as string | null,
        name: ''
    });

    useEffect(() => {
        loadData();
        loadClassifications();
        loadPatients();
        loadSpecialties();
    }, []);

    const showToast = (message: ToastMessage) => {
        setToast(message);
    };

    const loadData = async () => {
        try {
            const data = await requestService.getAll();
            setList(data);
        } catch (error) {
            showToast({
                severity: 'error',
                summary: 'Erro ao carregar dados',
                detail: 'Não foi possível carregar a lista de solicitações.'
            });
        }
    };

    const loadClassifications = async () => {
        try {
            const data = await enumService.getClassifications();
            setClassifications(data);
        } catch (error) {
            showToast({
                severity: 'error',
                summary: 'Erro ao carregar classificações',
                detail: 'Não foi possível carregar a lista de classificações.'
            });
        }
    };

    const loadPatients = async () => {
        try {
            const data = await patientService.getAll();
            setPatients(data);
        } catch (error) {
            showToast({
                severity: 'error',
                summary: 'Erro ao carregar pacientes',
                detail: 'Não foi possível carregar a lista de pacientes.'
            });
        }
    };

    const loadSpecialties = async () => {
        try {
            const data = await specialtyService.getAll();
            setSpecialties(data);
        } catch (error) {
            showToast({
                severity: 'error',
                summary: 'Erro ao carregar especialidades',
                detail: 'Não foi possível carregar a lista de especialidades.'
            });
        }
    };

    const handlePatientSelect = (patient: Patient | null) => {
        setItem(prev => ({
            ...prev,
            patientId: patient?.id || ''
        }));
    };

    const handleSpecialtySelect = (specialty: Specialty | null) => {
        setItem(prev => ({
            ...prev,
            specialtyId: specialty?.id || ''
        }));
    };

    const handleClassificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItem(prev => ({
            ...prev,
            classification: e.target.value
        }));
    };

    const validateForm = () => {
        const errors = [];

        if (!item.patientId) {
            errors.push('Paciente é obrigatório');
        }
        if (!item.specialtyId) {
            errors.push('Especialidade é obrigatória');
        }
        if (!item.classification) {
            errors.push('Classificação é obrigatória');
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
                await requestService.updateRequest(editingId, item);
                showToast({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Solicitação atualizada com sucesso!'
                });
            } else {
                await requestService.createRequest(item);
                showToast({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Solicitação cadastrada com sucesso!'
                });
            }

            await loadData();
            resetForm();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao salvar solicitação';
            showToast({
                severity: 'error',
                summary: 'Erro',
                detail: message
            });
        }
    };

    const handleEdit = (data: Request) => {
        setItem({
            patientId: data.patientId,
            specialtyId: data.specialtyId,
            classification: data.classification
        });
        setIsEditing(true);
        setEditingId(data.id);
    };

    const handleDeleteClick = (data: Request) => {
        setConfirmDialog({
            isOpen: true,
            id: data.id,
            name: data.patient?.name || 'Sem nome'
        });
    };

    const handleConfirmDelete = async () => {
        if (confirmDialog.id) {
            try {
                await requestService.delete(confirmDialog.id);
                showToast({
                    severity: 'success',
                    summary: 'Solicitação excluída',
                    detail: 'A solicitação foi excluída com sucesso.'
                });
                await loadData();
            } catch (error) {
                showToast({
                    severity: 'error',
                    summary: 'Erro ao excluir',
                    detail: 'Não foi possível excluir a solicitação.'
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
            patientId: '',
            specialtyId: '',
            classification: ''
        });
        setIsEditing(false);
        setEditingId(null);
    };

    const columns = [
        {
            field: 'patient' as keyof Request,
            header: 'Paciente',
            render: (data: Request) => data.patient?.name || '-'
        },
        {
            field: 'specialty' as keyof Request,
            header: 'Especialidade',
            render: (data: Request) => data.specialty?.name || '-'
        },
        {
            field: 'classification' as keyof Request,
            header: 'Classificação',
            render: (data: Request) => {
                const classification = classifications.find(c => c.value === data.classification);
                return classification ? classification.label : data.classification;
            }
        }
    ];

    return (
        <div>
            <Panel title="Cadastro de Solicitação">
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="col-6">
                        <AutoCompleteSelect<Patient>
                            label="Paciente"
                            name="patient"
                            value={patients.find(p => p.id === item.patientId) || null}
                            onChange={handlePatientSelect}
                            options={patients}
                            field="name"
                            filterBy={['name', 'cpf']}
                            renderOption={(patient) => `${patient.name} (${patient.cpf})`}
                            required
                        />
                    </div>
                    <div className="col-6">
                        <AutoCompleteSelect<Specialty>
                            label="Especialidade"
                            name="specialty"
                            value={specialties.find(s => s.id === item.specialtyId) || null}
                            onChange={handleSpecialtySelect}
                            options={specialties}
                            field="name"
                            required
                        />
                    </div>
                    <div className="col-6">
                        <Select
                            label="Classificação"
                            name="classification"
                            value={item.classification}
                            onChange={handleClassificationChange}
                            options={classifications}
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
                title="Lista de Solicitações"
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
                message={`Deseja realmente excluir a solicitação do paciente ${confirmDialog.name}?`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            <Toast message={toast} onClose={() => setToast(null)} />
        </div>
    );
};

export default RequestPage; 