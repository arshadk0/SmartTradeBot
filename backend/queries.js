const { response } = require("express");
const { Pool, Client } = require("pg");


const getOrders = (request, response)=>{
    //connect_database();
    pool.query("SELECT * FROM transactions", (err, res) => {
        if (err) {
          throw err
        }
        response.status(200).json(res.rows);
    })
}