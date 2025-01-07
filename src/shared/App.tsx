import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Paciente from '../pages/Paciente';


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paciente" element={<Paciente />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;