const route = require('express').Router();
const authenticateSupplier = require('../middlewares/authmiddleware');
const order = require('../models/order');
const { User, Supplier, Buyer } = require('../models/user');
const transporter = require('../mail');
const product = require('../models/product');




route.use(authenticateSupplier)

route.post('/create', async (req, res) => {
    try {
        let user_id = req.user.id;
        let buyer_id = await Buyer.findOne({ user: user_id });
        buyer_email=buyer_id.email;
        buyer_id = buyer_id._id;
        
        let newobj = new order({ supplier_id: req.body.supplier_id, buyer_id, product_id: req.body.product_id, quantity: req.body.quantity, status: 'confirmed' });
        await newobj.save();
        
        let product_det= await product.findOne({_id: newobj.product_id})
        let totamt=newobj.quantity*product_det.price;
      
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: buyer_email, 
            subject: 'Order Confirmation',
            html: `
            <h1>Order Confirmation</h1>
            <h2>Your order has been placed successfully!</h2>
            <h2>Order details</h2>
            <p><strong>Order ID:</strong> ${newobj._id}</p>
            <p><strong>ProductCategory:</strong> ${product_det.productCategory}</p>
            <p><strong>ProductName:</strong> ${product_det.productName}</p>
            <p><strong>Price/kg:</strong> ₹${product_det.price}</p>
            <p><strong>Quantity:</strong> ${newobj.quantity}</p>
            <p><strong>Total price:</strong>₹ ${totamt}</p>
            <p>Thank you for your purchase!</p>
           `
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ ok: false, message: 'Order placed but email failed' });
            }
            console.log('Email sent:', info.response);
        });
        res.status(200).json({ ok: true, message: 'sucessfully placed' })


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


        res.status(200).json({ ok: true, orders: orders });
    }
    catch (error) {
        console.log('error');
        res.status(500).json({ ok: false, message: "unable to fetch", error });
    }
})
module.exports = route;