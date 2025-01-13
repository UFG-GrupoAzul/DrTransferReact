import { ReactNode } from 'react';
import './styles.css';

interface Column<T> {
  field: keyof T;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (item: T) => void;
  title?: string;
  onEdit?: (item: T) => void;
  showEditButton?: boolean;
}

function DataTable<T>({ 
  data, 
  columns, 
  className = '', 
  onRowClick,
  title,
  onEdit,
  showEditButton = false
}: DataTableProps<T>) {
  const allColumns = [...columns];
  
  if (showEditButton) {
    allColumns.push({
      field: 'actions' as keyof T,
      header: 'Ações',
      render: (item: T) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(item);
          }}
          className="edit-button"
        >
          Editar
        </button>
      )
    });
  }

  return (
    <div className={`datatable-wrapper ${className}`}>
      {title && <h2 className="datatable-title">{title}</h2>}
      <table className="datatable">
        <thead>
          <tr>
            {allColumns.map((column, index) => (
              <th key={index} className="datatable-header">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'clickable' : ''}
            >
              {allColumns.map((column, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`} className="datatable-cell">
                  {column.render
                    ? column.render(item)
                    : String(item[column.field] || '')}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={allColumns.length} className="datatable-no-data">
                Nenhum registro encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable; 