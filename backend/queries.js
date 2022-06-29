const { response } = require("express");
const { Pool, Client } = require("pg");
var pool

async function initiatePool(Pool){
    pool = Pool
}

const getOrders = (request, response)=>{
    //connect_database();
    pool.query("SELECT * FROM transaction", (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}
const allTransactions = (request, response)=>{
    pool.query("SELECT * FROM transaction", (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}

const findTenMinsPrice = (request, response)=>{
    const time_stamp = request.query.time_stamp
    //console.log(request)
    pool.query('SELECT * FROM prices WHERE time_stamp='+time_stamp, (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}

module.exports = {allTransactions, initiatePool, findTenMinsPrice}