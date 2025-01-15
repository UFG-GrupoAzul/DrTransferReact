import { useState, useEffect } from 'react';
import Panel from '../../components/Panel';
import DataTable from '../../components/DataTable';
import requestService, { Request } from '../../services/requestService';
import './styles.css';

interface TransferModalData {
  isOpen: boolean;
  request: Request | null;
}

type Transport = 'LAND' | 'PLANE' | 'HELICOPTER';

interface RequestWithTransferStatus extends Request {
  isTransferred: boolean;
}

const TransferPage = () => {
  const [list, setList] = useState<RequestWithTransferStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<TransferModalData>({
    isOpen: false,
    request: null
  });
  const [selectedTransport, setSelectedTransport] = useState<Transport>('LAND');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await requestService.getAll();
      const enhancedData = data.map(request => ({
        ...request,
        isTransferred: false
      }));
      setList(enhancedData);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransferClick = (request: RequestWithTransferStatus) => {
    setModal({
      isOpen: true,
      request
    });
  };

  const handleModalClose = () => {
    setModal({
      isOpen: false,
      request: null
    });
    setSelectedTransport('LAND');
  };

  const handleTransferConfirm = async () => {
    if (!modal.request) return;

    try {
      setList(currentList => 
        currentList.map(item => 
          item.id === modal.request?.id 
            ? { ...item, isTransferred: true }
            : item
        )
      );
      handleModalClose();
    } catch (error) {
      console.error('Error updating transfer status:', error);
    }
  };

  const columns = [
    {
      field: 'patient',
      header: 'Paciente',
      render: (data: RequestWithTransferStatus) => data.patient?.name || '-'
    },
    {
      field: 'specialty',
      header: 'Especialidade',
      render: (data: RequestWithTransferStatus) => data.specialty?.name || '-'
    },
    {
      field: 'classification',
      header: 'Classificação',
      render: (data: RequestWithTransferStatus) => data.classification
    },
    {
      field: 'status',
      header: 'Status',
      render: (data: RequestWithTransferStatus) => (
        <span className={`status-badge ${data.isTransferred ? 'transferred' : 'pending'}`}>
          {data.isTransferred ? 'Transferido' : 'Pendente'}
        </span>
      )
    },
    {
      field: 'actions',
      header: 'Ações',
      render: (data: RequestWithTransferStatus) => (
        !data.isTransferred && (
          <button 
            className="btn-primary"
            onClick={() => handleTransferClick(data)}
          >
            Transferir
          </button>
        )
      )
    }
  ];

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="transfer-page">
      <Panel title="Transferências">
        <DataTable
          data={list}
          columns={columns}
          emptyMessage="Nenhuma solicitação encontrada"
        />
      </Panel>

      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Criar Transferência</h2>
            <p>Paciente: {modal.request?.patient.name}</p>
            
            <div className="form-group">
              <label>Tipo de Transporte:</label>
              <select 
                value={selectedTransport}
                onChange={(e) => setSelectedTransport(e.target.value as Transport)}
              >
                <option value="LAND">Terrestre</option>
                <option value="PLANE">Avião</option>
                <option value="HELICOPTER">Helicóptero</option>
              </select>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={handleModalClose}
              >
                Cancelar
              </button>
              <button 
                className="btn-primary"
                onClick={handleTransferConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferPage; 