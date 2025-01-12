import { ReactNode } from 'react';
import './styles.css';

interface PanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const Panel = ({ title, children, className = '' }: PanelProps) => {
  return (
    <div className={`panel ${className}`}>
      <div className="panel-header">
        <h3 className="panel-title">{title}</h3>
      </div>
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
};

export default Panel; 