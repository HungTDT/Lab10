require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())// dinh dang json

const account = require('./controller/account')
const product = require('./controller/product')
const order = require('./controller/order')
const mongodb = require('./db')

app.use('/api/account', account)
app.use('/api/products', product)
app.use('/api/orders', order)

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
console.log("Listening on Port 3000");
});

mongodb.connect()