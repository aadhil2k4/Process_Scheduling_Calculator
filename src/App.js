import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Table from './components/Table';

const App = () => {
  const handleEvaluate = (inputData) =>{
    console.log(inputData)
  }
  return (
    <div>
      <Navbar />
      <Table onEvaluate={handleEvaluate}/>
    </div>
  );
}

export default App;