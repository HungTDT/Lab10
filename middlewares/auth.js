const { ACCESS_TOKEN_SECRET } = process.env
var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { headers } = req
    const { access_token } = headers
    try {
        console.log(access_token)
        const token = jwt.verify(access_token, ACCESS_TOKEN_SECRET)
        const { email } = token
        next()
    } catch {
        return res.end(JSON.stringify({ code: 2, message: "Token Invalid or Hết hạn" }))
    }
}