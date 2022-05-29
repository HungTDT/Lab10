const { Schema, model } = require('mongoose')
const uuid = require('uuid')

const ProductSchema = Schema({
    _id: { type: String, default: uuid.v4 },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    photos: [{ type: String }],
    desc: { type: String }
})

module.exports = model('products', ProductSchema)