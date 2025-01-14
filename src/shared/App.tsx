import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Paciente from '../pages/Patient';
import { RegulatoryDoctorPage } from '../pages/RegulatoryDoctor';


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paciente" element={<Paciente />} />
        <Route path="specialty" element={<Specialty />} />
        <Route path="regulatory-doctor" element={<RegulatoryDoctorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;