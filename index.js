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

app.listen(3000, () => {
    console.log("http://localhost:3000")
})

mongodb.connect()