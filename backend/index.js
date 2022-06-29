const https = require('https')
const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const request = require("request");
const { application } = require('express');
const db = require('./queries.js')
const app = express()
const bodyParser = require('body-parser')
const { Pool, Client } = require("pg");
const { log } = require('console');
const api = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

var pool;
function connect_database(){
    pool = new Pool({
        user: 'team1',
        host: 'practisedb-fresher.cdsamxevdhkl.ap-south-1.rds.amazonaws.com',
        database: 'projects_db',
        password: 'Od@5$ge1vMX1qF3$Wr',
        port: 49218,
    })
    pool.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected!");
    });    
}

async function getLatestPrice(){
    var price
    const response = await axios.get(api) //working
    return response.data["price"];
}


async function createLatestPrice(time, price){
    pool.query("INSERT INTO prices (time_stamp, price)VALUES("+time+","+price+")",(err, res) => { //working
    });      
}

async function getPrevTenMinsPrice(cTime){
    const pTime = cTime-10
    const response = await axios.get("http://localhost:3000/findTenMinsPrice?time_stamp="+pTime) //working
    if(response.data.length == 0) return undefined
    return response.data[0]['price']
}

async function getPercentPriceDiff(cPrice, pPrice){ //working
    if(pPrice === undefined) return 0
    return (cPrice-pPrice)/pPrice;
}

async function getLastTrans(){   //working
    const response = await axios.get("http://localhost:3000/lastTransaction")
    return { "time":response.data[0]["time_stamp"], "btc":response.data[0]["updated_btc_inventory"], "usdt":response.data[0]["updated_usdt_inventory"] }
}
/************************************************************************ */
async function createOrder(priceDiff, time_stamp, currPrice, btc, usdt){
    var order_type, updated_btc, updated_usdt
    const trade_amount = 0.001
    const trade_value = trade_amount*currPrice;
    if(priceDiff>0.0002){
        order_type = "Sell"
        updated_btc = btc - trade_amount
        updated_usdt = usdt + trade_value
    }
    else{
        order_type = "Buy"
        updated_btc = btc + trade_amount
        updated_usdt = usdt - trade_value
    }
    pool.query("INSERT INTO transaction (time_stamp, order_type, trade_amount, trade_price, trade_value, updated_btc_inventory, updated_usdt_inventory)VALUES("+time_stamp+","+order_type+","+trade_amount+","+currPrice+","+trade_value+","+updated_btc+","+updated_usdt+")",(err, res) => { //working
        console.log(` ${time_stamp} ${order_type} ${trade_amount} ${currPrice} ${trade_value} ${updated_btc} ${updated_usdt}`);
    });
    /*pool.query("INSERT INTO transactions (time_stamp, order_type, trade_amount, trade_price, trade_value, updated_btc_inventory, updated_usdt_inventory)VALUES("+time_stamp+","+order_type+","+trade_amount+","+currPrice+","+trade_value+","+updated_btc+","+updated_usdt+")", (err, res) => {
        console.log(` ${time_stamp} ${order_type} ${trade_amount} ${currPrice} ${trade_value} ${updated_btc} ${updated_usdt}`);
    });*/
}

async function init() {
    connect_database();
    db.initiatePool(pool)
    cron.schedule('*/10 * * * * *', async () => {
        //get price from binance api
        const currPrice  = await getLatestPrice()
        //put it in db
        const currTime = Math.floor(new Date().getTime()/1000.0)
        await createLatestPrice(currTime, currPrice)

        //get prev 10min price
        const prevPrice = await getPrevTenMinsPrice(currTime)

        //do calculation
        const priceDiff = await getPercentPriceDiff(currPrice, prevPrice)
        console.log(`Pricediff is ${priceDiff}`);
        // check price is 2% up or down
        if(priceDiff>0.0002 || priceDiff<(-0.0002)){
            const lastTrans = await getLastTrans()  //get last trans details(time, btc, usdt)
            if(currTime - lastTrans['time']>300){
                //place order in database, update btc and update usdt
                await createOrder(priceDiff, currTime, currPrice, lastTrans['btc'], lastTrans['usdt'])
            }
        }
    });
}



app.get('/allTransactions', db.allTransactions)
app.get('/findTenMinsPrice', db.findTenMinsPrice)



const PORT = 3000;
app.listen(PORT, function () {
    console.log("Server Started on Port " + PORT);
});

init().then(() => { console.log('Function is started.'); });