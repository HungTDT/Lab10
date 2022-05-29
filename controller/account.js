const express = require('express')
const User = require('../model/user')
const bcrypt = require('bcrypt')
const { ACCESS_TOKEN_SECRET } = process.env
var jwt = require('jsonwebtoken');
const loginValidator= require('../middlewares/loginValidator')
const router = express.Router()
router.post('/login', async (req, res) => {
    let { email, password } = req.body
    let user = await User.findOne({ email:email })

    if (!user) return res.end(JSON.stringify({ code: 1, message: "username khong hop le" }))

    let matched = bcrypt.compareSync(password, user.password)
    if (!matched) {
        return res.end(JSON.stringify({ code: 2, message: "password khong hop le" }))
    }

    var token = jwt.sign({ 
        data: { email, _id: user._id }, 
        exp: Math.floor(Date.now() / 1000) + (1 * 60),
    }, ACCESS_TOKEN_SECRET);

    return res.end(JSON.stringify({ code: 0, message: "Success", data: token }));
})

router.post('/register', async (req, res) => {
    let { email, password } = req.body
    console.log(email, password)
    let user = await User.findOne({ email:email })

    if (user) return res.end(JSON.stringify({ code: 1, message: "Email da ton tai" }))

    let hashed = bcrypt.hashSync(password, 10);
    user = User({
        email, password: hashed
    })
    await user.save();

    return res.end(JSON.stringify({ code: 0, message: "Success", data:user }));
})

module.exports = router