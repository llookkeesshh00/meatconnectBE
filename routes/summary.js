const route = require('express').Router();
const authenticateSupplier = require('../middlewares/authmiddleware');
const Delivery = require('../models/delivery');
const { User, Supplier, Buyer } = require('../models/user');
const order= require('../models/order')
const moment= require('moment');

route.get('/getsummary', authenticateSupplier, async (req, res) => {
    try {
        
        let user_id = req.user.id;
        let buyer_id = await Buyer.findOne({ user: user_id })
        buyer_id=buyer_id._id;
        let orders = await order.find({ buyer_id }).populate('product_id');
        
        let ordersByMonth = {};

        // Group orders by the month and year
        orders.forEach(order => {
            let orderMonth = moment(order.order_date).format('YYYY-MM');  // 'YYYY-MM' format to group by month and year
            
            if (!ordersByMonth[orderMonth]) {
                ordersByMonth[orderMonth] = [];
            }
            
            ordersByMonth[orderMonth].push(order);
        });

       console.log(ordersByMonth)
        res.status(200).json({ok:true,ordersByMonth})
        
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, error, messsage: "internal error" })
    }

})

module.exports = route;