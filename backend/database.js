const { response } = require("express");
const { Pool, Client } = require("pg");
require('dotenv').config({path: './.env'})
var pool;
function connect_database(){
    pool = new Pool({
        user: process.env.User,
        host: process.env.Host,
        database: process.env.Database,
        password: process.env.Password,
        port: process.env.Port,
    })
    pool.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected!");
    });    
}
console.log(typeof parseFloat(process.env.tradeAmount));
//connect_database()
const wallet = (request, response)=>{
    //connect_database();
    pool.query("SELECT time, btc, usdt FROM wallet ORDER BY time DESC LIMIT 1", (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}
const all_transaction = (request, response)=>{
    //connect_database();
    pool.query("SELECT * FROM transaction", (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}

const update_wallet = (request, response)=>{
    const {time, btc, usdt} = request.body;
    pool.query("INSERT INTO wallet (time, btc, usdt) VALUES ("+time+","+btc+","+usdt+")", (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}/*
const createOrder = (request, response)=>{

}
*/
//connect_database();


