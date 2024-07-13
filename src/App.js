import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Table from './components/Table';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Table />} />
      </Routes>
    </div>
  );
}

export default App;
