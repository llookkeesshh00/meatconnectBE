const route = require('express').Router();
const authenticateSupplier = require('../middlewares/authmiddleware');
const order = require('../models/order');
const { User, Supplier, Buyer } = require('../models/user');

//middleware

route.use(authenticateSupplier)

route.post('/create', async (req, res) => {
    try {
        let user_id = req.user.id;
        let buyer_id = await Buyer.findOne({ user: user_id });
        buyer_id = buyer_id._id;
        let newobj = new order({ supplier_id: req.body.supplier_id, buyer_id, product_id: req.body.product_id, quantity: req.body.quantity, status: 'confirmed' });
        await newobj.save();
        res.status(200).json(200).status({ ok: true, message: 'sucessfully placed' })


    }


    catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, error, message: "error in placing order" })
    }

})



route.get('/getOrders', async (req, res) => {
    try {
        let user_id = req.user.id;
        let buyer_id = await Buyer.findOne({ user: user_id });
        buyer_id = buyer_id._id;

        let orders = await order.find({ buyer_id }).populate('product_id');

      
        res.status(200).json({ ok: true, orders:orders });
    }
    catch (error) {
        console.log('error');
        res.status(500).json({ ok: false, message:"unable to fetch" ,error});
    }
})
module.exports = route;