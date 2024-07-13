import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Table from './components/Table';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Table />} />
      </Routes>
    </div>
  );
}

export default App;
