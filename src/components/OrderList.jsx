import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react'
import '../App.css';

const OrderList = () => {
 
  const [orders , setOrders] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3000/allTransactions")
    .then(res => res.data)
    .then(data => setOrders(data))
  } , [])
  
  return (
    <>
    <div className='heading'>
       Order History
    </div>
    
    <div>
    <table>
      <thead>
  <tr>
    <th>Time</th>
    <th>Order Type</th>
    <th>Trade Amount</th>
    <th>Trade Price</th>
    <th>Trade Value</th>
    <th>BTC left</th>
    <th>USDT left</th>
  </tr>
  </thead>
  
  <tbody>
  {/* <tr>
    <td>1656515540</td>
    <td> Buy </td>
    <td>0.001</td>
    <td>19000.8274</td>
    <td>19.0008274</td>
    <td>1.01</td>
    <td>9910</td>
  </tr> */}
{
  orders.map((order) => {
    return (

      <tr>
  <td>{order.time_stamp}</td>
  <td>{order.order_type}</td>
  <td>{order.trade_amount}</td>
  <td>{order.trade_price}</td>
  <td>{order.trade_value}</td>
  <td>{order.updated_btc_inventory}</td>
  <td>{order.updated_usdt_inventory}</td>
  </tr>

    )
  })
}

  </tbody>
</table>
    </div>
    
    </>
  )
}

export default OrderList