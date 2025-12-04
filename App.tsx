import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Display } from './pages/Display';
import { Control } from './pages/Control';
import { Admin } from './pages/Admin';
import { Client } from './pages/Client';
import { Print } from './pages/Print';
import { Booking } from './pages/Booking';
import { Doctors } from './pages/Doctors';
import { About } from './pages/About';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/display" element={<Display />} />
        <Route path="/control" element={<Control />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/client" element={<Client />} />
        <Route path="/print" element={<Print />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
};

export default App;