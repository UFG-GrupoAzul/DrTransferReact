import Panel from '../../components/Panel';
import DataTable from '../../components/DataTable';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  crm: string;
}

const Doctor = () => {
  // Dados de exemplo
  const doctors: Doctor[] = [
    { id: 1, name: 'Dr. João Silva', specialty: 'Cardiologia', crm: '123456' },
    { id: 2, name: 'Dra. Maria Santos', specialty: 'Neurologia', crm: '789012' },
  ];

  const columns = [
    { field: 'name' as const, header: 'Nome' },
    { field: 'specialty' as const, header: 'Especialidade' },
    { field: 'crm' as const, header: 'CRM' },
  ];

  const handleRowClick = (doctor: Doctor) => {
    console.log('Médico selecionado:', doctor);
  };

  return (
    <div>
      <Panel title="Cadastro de Médico">
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <input type="text" placeholder="Nome" className="form-input" />
          <input type="text" placeholder="Especialidade" className="form-input" />
          <input type="text" placeholder="CRM" className="form-input" />
        </div>
      </Panel>

      <Panel title="Lista de Médicos">
        <DataTable
          data={doctors}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </Panel>
    </div>
  );
};

export default Doctor;
