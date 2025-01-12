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
}

function DataTable<T>({ data, columns, className = '', onRowClick }: DataTableProps<T>) {
  return (
    <div className={`datatable-wrapper ${className}`}>
      <table className="datatable">
        <thead>
          <tr>
            {columns.map((column, index) => (
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
              {columns.map((column, colIndex) => (
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
              <td colSpan={columns.length} className="datatable-no-data">
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