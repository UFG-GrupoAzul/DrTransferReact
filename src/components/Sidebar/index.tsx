import { Link } from 'react-router-dom';
import './styles.css';

const Sidebar = () => {
  const menuItems = [
    { path: '/hospital', label: 'Hospitais' },
    { path: '/specialty', label: 'Especialidades' },
    { path: '/patient', label: 'Pacientes' },
    { path: '/doctor', label: 'Médicos' },
    { path: '/regulatory-doctor', label: 'Médicos Reguladores' },
    { path: '/request', label: 'Solicitações' },
    { path: '/transfer', label: 'Transferências' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo-link">
          <h2>DrTransfer</h2>
        </Link>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="sidebar-link"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 