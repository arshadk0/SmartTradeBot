
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
        console.log(`Currency is and price is ${price}`);
        //database.insert_data(price);
        
    })
    return price
}


function createLatestPrice(time, price){
    pool.query("INSERT INTO prices (time_stamp, price)VALUES("+time+","+price+")",(err, res) => {
          console.log(`Inserted time = ${time} with price = ${price}`)
        }
    );      
}

async function getPrevTenMinsPrice(cTime){
    const pTime = cTime-10
    var pPrice
    pool.query("SELECT price from prices WHERE time_stamp="+pTime, (err, res)=>{
        if(err){
            console.log(err);
        }
        else{
            pPrice = res.rows[0]['price']
            //console.log(`current time is ${cTime}, prev time is ${pTime}, prev price is ${res.rows[0]['price']}`);
        }
    })
    return pPrice
}

function calculation(){

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
        const cTime = Math.floor(new Date().getTime()/1000.0)
        //console.log(typeof(cTime));
        createLatestPrice(cTime, price)

        //get prev 10min price
        const prevPrice = await getPrevTenMinsPrice(cTime)
        console.log(`prev price ${prevPrice}`);

        //do calculation
        calculation()


        //get last transaction time




        
        //if(2% up/down && last ttrans time> 5min)
        //else()

    });
}





const PORT = 3000;
app.listen(PORT, function () {
    console.log("Server Started on Port " + PORT);
});

init().then(() => { console.log('Function is started.'); });