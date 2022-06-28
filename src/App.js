import React from 'react'
import './App.css';
import Chart from './components/Chart';
import Inventory from './components/Inventory';
import OrderList from './components/OrderList';

function App() {
  return (
    <div className="App">
      <Inventory />
      <OrderList />
      <Chart />
    </div>
  );
}

export default App;
