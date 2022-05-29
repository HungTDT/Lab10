const express = require('express')
const Product= require('../model/product')
const jwt= require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET}= process.env
const router = express.Router()
const CheckLogin = require('../middlewares/auth')
const multer= require('multer')

const storage= multer.diskStorage({
    destination: "static/uploads",
    filename: (req, file, cb) =>{
        cb(null, Date.now() + "_"+ file.originalname);
    }
})

const upload= multer ({ 
    storage: storage
})

router.get('/', (req, res) => {
    Product.find().select('name price desc photos')
    .then(products =>{
        res.end(JSON.stringify({ code: 0, message: "Read List Product Success",
                data:products}));
    })
})

router.post('/', CheckLogin, (req, res) => {
    let upload_handler= upload.array("files[]")
    upload_handler(req, res, async err =>{
            if(err){
                return res.end(JSON.stringify({code: 2, message: err.message}))
            }
            let photos= null;
            if(!req.files){
                photos=[]
            }
            else{
                photos= req.files.map(file => file.path)
            }
        

        let{headers} = req
        let{access_token}= headers
        try{
            let token= jwt.verify(access_token, ACCESS_TOKEN_SECRET)
        }
        catch(error){
            return res.end(JSON.stringify({ code: 2, message: "Denied"}));
        }
        
        let products = await Product.find()
        const {name, price, desc}= req.body
        products= new Product(
            {name, price, desc, photos}
        ) 
        products.save()
        return res.end(JSON.stringify({ code: 0, message: "Add Product Successfully", data: products}));
    })
})

router.put('/:id', CheckLogin, (req, res) => {
    let {id}= req.params
    if(!id){
        return res.end(JSON.stringify({ code: 1, message: "Id khong ton tai"}));
    }

    let supportedFields =['name','price','desc','photos']
    let updateData= req.body
    if(!updateData){
        return res.end(JSON.stringify({ code: 1, message: "Không có dữ liệu để update"}));
    }

    for (field in updateData){//chỉ nhận các thuộc tính nằm trong danh sách
        if(!supportedFields.includes(field)){
            delete updateData[field]; //xóa các fields không đc htro
        }
    }

    Product.findByIdAndUpdate(id, updateData, {
        new: true // update xong sẽ trả về data mới
    })
    .then(products=>{
        if(products){
            return res.json({ code: 0, message: "Đã cập nhật sản phẩm"})
        }
        else{
            return res.json({ code: 2, message: "Không tìm thấy sản phẩm"})
        }
    })
    .catch(e =>{
        return res.json({ code: 3, message: e.message})
    })
})

router.delete('/:id', CheckLogin,(req, res) => {
    let {id}= req.params
    if(!id){
        return res.end(JSON.stringify({ code: 1, message: "Id khong ton tai"}));
    }
    Product.findByIdAndDelete(id)
    .then(products=>{
        if(products){
            return res.json({ code: 0, message: "Đã xóa sản phẩm"})
        }
        else{
            return res.json({ code: 2, message: "Không tìm thấy sản phẩm"})
        }
    })
    .catch(e =>{
        return res.json({ code: 3, message: e.message})
    })
})
//Find info chi tiet theo id
router.get('/:id', (req, res) => {
    let {id}= req.params
    if(!id){
        return res.end(JSON.stringify({ code: 1, message: "Id khong ton tai"}));
    }
    Product.findById(id)
    .then(products=>{
        if(products){
            return res.json({ code: 0, message: "Đã tìm thấy sản phẩm", data:products})
        }
        else{
            return res.json({ code: 2, message: "Không tìm thấy sản phẩm"})
        }
    })
    .catch(e =>{
        return res.json({ code: 3, message: e.message})
    })
})

module.exports = router