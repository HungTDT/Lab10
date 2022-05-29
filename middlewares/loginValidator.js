const {check} = require('express-validator')

module.exports=[
    check('email')
    .exists().withMessage("Vui long nhap email")
    .notEmpty().withMessage("Khong duoc de trong email")
    .isEmail().withMessage("Email khong hop le"),

    check('password')
    .exists().withMessage("Vui long nhap mat khau")
    .notEmpty().withMessage("Khong duoc de trong mat khau")
    .isLength({min: 6}).withMessage("Mat khau can co it nhat 6 ky tu")
]