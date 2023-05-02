const router = require('express').Router();
const Offer = require('../models/Offers');
const User = require('../models/User');
const upload = require('../middleware/handleImages');
const checkCondition = require('../middleware/checkCondition')

router.get('/', async(req, res)=>{
    const {page=1, query, records=5, attribute} = req.query;
    try {
        let data;
        const user = await User.findOne({'_id': req.user});
        if(user.role === 'admin'){
            if(query){
                data = await Offer.find({[attribute || 'offerId']: {$regex: query, $options: '-i'}}).populate({
                    path: 'content',
                    populate: {
                        path: 'item',
                        ref: 'products'
                    }
                }).skip((page-1) * records).limit(records);
            }else{
                data = await Offer.find().skip((page-1) * records).limit(records).populate({
                    path: 'content',
                    populate: {
                        path: 'item',
                        ref: 'products'
                    }
                });
            }
            return res.status(200).json({
                status: 'success',
                data
            })
        }
        else{
            if(query){
                data = await Offer.find({[attribute || 'offerId']: {$regex: query, $options: '-i'}}).populate({
                    path: 'content',
                    populate: {
                        path: 'item',
                        ref: 'products'
                    }
                })
            }else{
                data = await Offer.find().populate({
                    path: 'content',
                    populate: {
                        path: 'item',
                        ref: 'products'
                    }
                });
            }
        }
        let applicableOffers = data.filter((offer, index)=>checkCondition(user, offer)).slice(((page-1)*records), (page * records))
        return res.status(200).json({
            status: 'success',
            data: applicableOffers
        })
    } 
    catch(e){
        return res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
})

router.get('/checkId', async(req, res)=>{
    try {
        const {offerId} = req.query;
        const offer = await Offer.findOne({offerId});
        if(offer){
            return res.status(400).json({
                status: 'failure',
                message: 'offer Id is not available'
            })
        }
        return res.status(200).json({
            status: 'success',
            message: 'Offer Id is available'
        })
    } 
    catch(e){
        return res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
})


// default route!
router.post('/', upload, async (req, res)=>{
    try {
        const user = await User.findOne({"_id": req.user});
        if(user.role === 'player'){
            return res.status(401).json({
                status: 'failure',
                message: 'endpoint accessible by Admins only! access denied!!'
            })
        }
        let offer = await Offer.findOne({'offerId': req.body.offerId})
        if(offer){
            return res.status(400).json({
                status: 'failure',
                message: 'offer already Exists'
            })
        }
        const {offerId, offerTitle, offerDescription, content, schedule, target, pricing} = req.body
        const obj = {
            offerId,
            offerTitle,
            offerDescription,
            content: JSON.parse(content),
            schedule: JSON.parse(schedule),
            target,
            pricing: JSON.parse(pricing),
            offerImage: req.file.filename
        }
        offer = await Offer.create(obj);
        res.status(201).json({
            status: 'success',
            offer
        })

    } 
    catch(e){
        return res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
})

// endpoint ==> Edit offer
router.put('/:offerId', async (req, res)=>{
    try {
        const {offerId} = req.params;
        const offer = await Offer.updateOne({offerId}, {
            $set: req.body
        })
        res.json({
            status: 'success',
            message: 'Offer Updated Successfully',
            offer
        })
    } 
    catch(e){
        return res.status(500).json({
            status: 'failure',
            message: e.message
        })
    }
})


// endpoint for deleting the offer.
router.delete('/:offerId', async (req, res)=>{
    try {
        const {offerId} = req.params;
        const offer = await Offer.deleteOne({offerId})
        res.json({
            status: 'success',
            message: 'Offer Deleted Successfully',
            offer
        })
    } 
    catch(error){
        return res.status(500).json({
            status: 'failure',
            message: error.message
        })
    }
})
module.exports = router;