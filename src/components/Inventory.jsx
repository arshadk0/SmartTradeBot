import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../App.css';
// import 'antd/dist/antd.css';

const Inventory = () => {
  
  const [wallet , setWallet] = useState([])
  const [btcUsdtPrice , setbtcUsdtPrice] = useState(0) 

  var btcStream = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker")
  btcStream.onmessage = function(event){
    // console.log(JSON.parse(event.data)["c"])
    setbtcUsdtPrice(JSON.parse(event.data)["c"])
  }

  useEffect(() => {
    axios.get("http://localhost:3000/getWallet")
    .then(res => res.data)
    .then(data => setWallet(data))
  } , [])
  
  
  return (
    <>
   
    <div className='invent-container'>
        {/* <div className='heading'>
             Wallet
        </div> */}
        {/* <div className='btc-box'>
            <h4>BTC : <span>{1}</span></h4>
        </div>
        <div className='usdt-box'>
            <h4>USDT : <span>{10000}</span></h4>
        </div> */}

<div className='btcusdt-box'>
            {/* <h4>Real time price</h4> */}
            <h4>1 BTC = <span>{btcUsdtPrice === 0 ? "Fetching..." : btcUsdtPrice}</span> USDT</h4>
           
        </div>

        {
          wallet.map(data => {
            return (
              <div >
                <h4>Real time price</h4>
              <div className='btc-box'>
            <h4>BTC left : <span>{data.updated_btc_inventory.toFixed(3)}</span></h4>
          </div>
          <div className='btc-box'>
            <h4>USDT left: <span>{data.updated_usdt_inventory.toFixed(3)}</span></h4>
          </div>
          
              </div>
              
            )
          })
        }

    </div>
    </>
  )
}

export default Inventory