import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Patient from '../pages/Patient';
import Doctor from '../pages/Doctor';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="patient" element={<Patient />} />
        <Route path="doctor" element={<Doctor />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 