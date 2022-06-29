
const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const request = require("request");
const { application } = require('express');
const db = require('./queries.js')
const app = express()
const bodyParser = require('body-parser')
const { Pool, Client } = require("pg");
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
    await axios.get(api).then(response=>{
        price = response.data["price"];
        //console.log(`Currency is and price is ${price}`);
        //database.insert_data(price);
        
    })
    return price
}


async function createLatestPrice(time, price){
    pool.query("INSERT INTO prices (time_stamp, price)VALUES("+time+","+price+")",(err, res) => {
        //console.log(`Inserted time = ${time} with price = ${price}`)
        }
    );      
}

async function getPrevTenMinsPrice(cTime, cPrice){
    const pTime = cTime-10
    var pPrice
    pool.query("SELECT price from prices WHERE time_stamp ="+pTime, (err, res)=>{
        if(err){
            console.log(err);
        }
        else{
            if(res.rows.length == 0) pPrice = cPrice;
            else pPrice = res.rows[0]['price']
            console.log(pPrice);
            //pPrice = res.rows[0]['price']
            //console.log(`current time is ${cTime}, prev time is ${pTime}, prev price is ${res}`);
        }
    });
    return pPrice
}

async function getPercentPriceDiff(cPrice, pPrice){
    const diff = (cPrice-pPrice)/pPrice;
    //console.log(diff)
    return diff
}

async function getLastTrans(){
    var time, btc, usdt;
    pool.query("SELECT * FROM transactions ORDER BY time_stamp DESC LIMIT 1", (err, res) => {
        time = res.rows[0]['time_stamp']
        btc = res.rows[0]['updated_btc_inventory']
        usdt = res.rows[0]['updated_usdt_inventory']
        //console.log(res.rows[0]['updated_usdt_inventory']);
    });
    //console.log(usdt);
    return [time, btc, usdt]
}

async function createOrder(priceDiff, time_stamp, currPrice, btc, usdt){
    var order_type, updated_btc, updated_usdt
    const trade_amount = 0.001
    const trade_value = trade_amount*currPrice;
    if(priceDiff>0.02){
        order_type = "Sell"
        updated_btc = btc - trade_amount
        updated_usdt = usdt + trade_value
    }
    else{
        order_type = "Buy"
        updated_btc = btc + trade_amount
        updated_usdt = usdt - trade_value
    }
    pool.query("INSERT INTO transactions (time_stamp, order_type, trade_amount, trade_price, trade_value, updated_btc_inventory, updated_usdt_inventory)VALUES("+time_stamp+","+order_type+","+trade_amount+","+currPrice+","+trade_value+","+updated_btc+","+updated_usdt+")", (err, res) => {
        console.log(` ${time_stamp} ${order_type} ${trade_amount} ${currPrice} ${trade_value} ${updated_btc} ${updated_usdt}`);
    });
}

async function init() {
    //connect database
    connect_database();
    
    //start Bot
    cron.schedule('*/10 * * * * *', async () => {
        //get price from binance api
        const currPrice  = await getLatestPrice()
        //const price = 20000.999
        console.log(`returned ${currPrice}`)
        
        //put it in db
        const currTime = Math.floor(new Date().getTime()/1000.0)
        //console.log(typeof(cTime));
        await createLatestPrice(currTime, currPrice)

        //get prev 10min price
        const prevPrice = await getPrevTenMinsPrice(currTime, currPrice)
        console.log(`prev price ${prevPrice}`);

        //do calculation
        const priceDiff = await getPercentPriceDiff(currPrice, 19000)
        //console.log(priceDiff)
  
        // check price is 2% up or down
        if(priceDiff>0.02 || priceDiff<(-0.02)){

        //get last trans details(time, btc, usdt)
            const lastTrans = await getLastTrans()
            lastTrans[0] = 1487989656
            lastTrans[1] = 999
            lastTrans[2] = 10000
            const lastTransTime = lastTrans[0]
            const btc_wallet = lastTrans[1]
            const usdt_wallet = lastTrans[2]
            if(currTime - lastTransTime>300){
                //place order in database, update btc and update usdt
                await createOrder(priceDiff, currTime, currPrice, btc_wallet, usdt_wallet)
            }
        }
    });
}



app.get('/createOrder', createOrder)



const PORT = 3000;
app.listen(PORT, function () {
    console.log("Server Started on Port " + PORT);
});

init().then(() => { console.log('Function is started.'); });