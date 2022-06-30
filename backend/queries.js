const { response, request } = require("express");
const { Pool, Client } = require("pg");
var pool

async function initiatePool(Pool){
    pool = Pool
}

const allTransactions = (request, response)=>{
    pool.query("SELECT * FROM transaction", (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}

const lastTransaction = (request, response)=>{
    pool.query("SELECT * FROM transaction ORDER BY time_stamp DESC LIMIT 1", (err, res) => {
        if (err) {
          throw err
        }
        //if(res.rows.length == 0) response.status(200).json([{"time_stamp":"0","order_type":"-","trade_amount":0.0,"trade_price":0.0,"trade_value":0.0,"updated_btc_inventory":1000.00,"updated_usdt_inventory":10000.00}])
        response.status(200).json(res.rows);
    })
}

const findTenMinsPrice = (request, response)=>{
    const time_stamp = request.query.time_stamp
    pool.query('SELECT * FROM prices WHERE time_stamp='+time_stamp, (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}


const getWallet = (request, response)=>{
    pool.query("SELECT time_stamp, updated_btc_inventory, updated_usdt_inventory FROM transaction ORDER BY time_stamp DESC LIMIT 1", (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}

module.exports = {allTransactions, initiatePool, findTenMinsPrice, lastTransaction, getWallet}