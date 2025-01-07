import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Paciente from '../pages/Paciente';

function App() {



  return (


    
    <Router>
      <Routes>
        <Route path="*" >
          <Route index element = {<Home/>}/>
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/paciente" element={<Paciente />} />
      </Routes>
    </Router>
  );
}

export default App;