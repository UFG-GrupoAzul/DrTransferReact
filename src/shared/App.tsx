import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Paciente from '../pages/Patient';
import DoctorPage from '../pages/Doctor';
import RequestPage from '../pages/Request';
import SpecialtyPage from '../pages/Specialty';
import RegulatoryDoctorPage from '../pages/RegulatoryDoctor';


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paciente" element={<Paciente />} />
        <Route path="specialty" element={<SpecialtyPage />} />
        <Route path="doctor" element={<DoctorPage />} />
        <Route path="regulatory-doctor" element={<RegulatoryDoctorPage />} />
        <Route path="request" element={<RequestPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;