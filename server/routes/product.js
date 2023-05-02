const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/handleImages');

router.get('/', async (req,res)=>{
    const {page} = req.query;
    try{
        let totalResults = await Product.find().count()
        let data;
        if(page){
            data = await Product.find().skip((page-1) * 5).limit(5);
        }else{
            data = await Product.find();
        }
        
        res.status(200).json({
            status: 'success',
            totalResults,
            result: [...data]
        });
    }
    catch(e){
        res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
})

router.post('/',upload, [
    body('name', "Name should be of min 5 characters!!" ).isLength({min: 3}),
    body('description', "Description must have atleast 5 characters").isLength({min: 5}),
], async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: 'failure',
            message: errors.array()
        })
    }
    try{
        const user = await User.findOne({"_id": req.user});
        if(user.role === 'player'){
            return res.status(401).json({
                status: 'failure',
                message: 'endpoint accessible by Admins only! access denied!!'
            })
        }
        const obj = {
            name: req.body.name,
            description: req.body.description,
            image: req.file.filename,
            user: req.user
        }
        let product = await Product.create(obj);
        return res.status(201).json({
            status: 'success',
            message: 'product creation successful!!',
            product
        })
    }catch(e){
        return res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
    
});

router.put('/:id', async (req, res)=>{
    console.log(req.body)
    try{
        let user = await User.findOne({"_id": req.user})
        if(user.role === 'player'){
            return res.status(401).json({
                status: 'failure',
                message: 'endpoint accessible by Admins only! access denied!!'
            })
        }
        let product = await Product.findOne({'_id' : req.params.id})
        product = await Product.updateOne({'_id' : req.params.id}, {$set : req.body})
        return res.status(202).json({
            status: 'success',
            result: product
        })
    }catch(error){
        return res.status(500).json({
            status: 'failure',
            message: error.message
        })
    }
})


module.exports = router