import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Patient from '../pages/Patient';
import Doctor from '../pages/Doctor';
import Specialty from '../pages/Specialty';
import Hospital from '../pages/Hospital';
import RegulatoryDoctor from '../pages/RegulatoryDoctor';
import Request from '../pages/Request';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="patient" element={<Patient />} />
        <Route path="doctor" element={<Doctor />} />
        <Route path="specialty" element={<Specialty />} />
        <Route path="hospital" element={<Hospital />} />
        <Route path="regulatory-doctor" element={<RegulatoryDoctor />} />
        <Route path="request" element={<Request />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 