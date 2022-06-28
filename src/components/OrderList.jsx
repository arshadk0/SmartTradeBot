import React from 'react'
import '../App.css';

const OrderList = () => {
  return (
    <>
    <div className='heading'>
       Order History
    </div>
    
    <div>
    <table>
      <thead>
  <tr>
    <th>Transaction Type</th>
    <th>Profit/Loss</th>
    <th>Time</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>Purchase</td>
    <td> Profit </td>
    <td>1 AM</td>
  </tr>
  <tr>
  <td>Purchase</td>
    <td> Profit </td>
    <td>1 AM</td>
  </tr>
  <tr>
  <td>Purchase</td>
    <td> Profit </td>
    <td>1 AM</td>
  </tr>
  <tr>
  <td>Purchase</td>
    <td> Profit </td>
    <td>1 AM</td>
  </tr>
  <tr>
  <td>Purchase</td>
    <td> Profit </td>
    <td>1 AM</td>
  </tr>
  <tr>
  <td>Purchase</td>
    <td> Profit </td>
    <td>1 AM</td>
  </tr>
  </tbody>
</table>
    </div>
    
    </>
  )
}

export default OrderList