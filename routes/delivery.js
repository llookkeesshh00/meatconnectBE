const route = require('express').Router();
const authenticateSupplier = require('../middlewares/authmiddleware');
const Delivery = require('../models/delivery');
const { User, Supplier, Buyer } = require('../models/user');

route.get('/getAdress', authenticateSupplier, async (req, res) => {
    try {
     
        let user_id = req.user.id;
        let buyer_id = await Buyer.findOne({ user: user_id })
        let deliveryDetails = await Delivery.find({ buyer: buyer_id._id });

       // console.log(deliveryDetails);
        res.status(200).json({ok:true,deliveryDetails})
        
    } 
    catch (error) {
        res.status(500).json({ ok: false, error, messsage: "internal error" })
    }

})

module.exports = route;