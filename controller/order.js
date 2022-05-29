const express = require('express');
const Order = require('../model/order');
const auth = require('../middlewares/auth')

const router = express.Router()
router.get('/', auth, async (req, res) => {
    let orders = await Order.find()
    res.end(JSON.stringify({ code: 0, message: "Success", data: orders}));
})

router.post('/', async (req, res) => {
    let { cart_items } = req.body
    let amount = 0
    for(const cart_item of cart_items) {
        let { price, qty } = cart_item
        amount += price * qty
    }
    let order = Order({
        amount, cart_items
    })
    await order.save()

    res.end(JSON.stringify({ code: 0, message: "Success", data: order}));
})
router.put('/:id',(req, res) => {

})
router.delete('/:id', (req, res) => {

})

module.exports = router