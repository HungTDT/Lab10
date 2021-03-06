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
        return res.end(JSON.stringify({ code: 1, message: "Kh??ng c?? d??? li???u ????? update"}));
    }

    for (field in updateData){//ch??? nh???n c??c thu???c t??nh n???m trong danh s??ch
        if(!supportedFields.includes(field)){
            delete updateData[field]; //x??a c??c fields kh??ng ??c htro
        }
    }

    Product.findByIdAndUpdate(id, updateData, {
        new: true // update xong s??? tr??? v??? data m???i
    })
    .then(products=>{
        if(products){
            return res.json({ code: 0, message: "???? c???p nh???t s???n ph???m"})
        }
        else{
            return res.json({ code: 2, message: "Kh??ng t??m th???y s???n ph???m"})
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
            return res.json({ code: 0, message: "???? x??a s???n ph???m"})
        }
        else{
            return res.json({ code: 2, message: "Kh??ng t??m th???y s???n ph???m"})
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
            return res.json({ code: 0, message: "???? t??m th???y s???n ph???m", data:products})
        }
        else{
            return res.json({ code: 2, message: "Kh??ng t??m th???y s???n ph???m"})
        }
    })
    .catch(e =>{
        return res.json({ code: 3, message: e.message})
    })
})

module.exports = router