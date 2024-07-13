import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Table from './components/Table';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Table} />
      </Switch>
    </div>
  );
}

export default App;
