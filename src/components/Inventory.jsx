import React from 'react'
import '../App.css';

const Inventory = () => {
  return (
    <>
   
    <div className='invent-container'>
        <div className='heading'>
             Wallet
        </div>
        <div className='btc-box'>
            <h4>BTC : <span>{1}</span></h4>
        </div>
        <div className='usdt-box'>
            <h4>USDT : <span>{10000}</span></h4>
        </div>
    </div>
    </>
  )
}

export default Inventory