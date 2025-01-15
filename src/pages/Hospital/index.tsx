import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import hospitalService, { Hospital } from '../../services/hospitalService';
import './styles.css';

const HospitalPage = () => {
  const [list, setList] = useState<Hospital[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await hospitalService.getAll();
      setList(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const columns = [
    { field: 'name' as const, header: 'Nome' },
    { field: 'phone' as const, header: 'Telefone' },
    { 
      field: 'availableBeds' as const, 
      header: 'Leitos Disponíveis',
      render: (data: Hospital) => (
        <span className={data.availableBeds > 0 ? 'beds-available' : 'beds-unavailable'}>
          {data.availableBeds}
        </span>
      )
    }
  ];

  return (
    <div>
        <DataTable 
          data={list}
          columns={columns}
          title="Hospitais"
        />
    </div>
  );
};

export default HospitalPage; 