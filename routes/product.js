const route = require('express').Router();
const Product = require('../models/product');


route.get('/getProductDetails', async (req, res) => {
    try {
        let { productId } = req.query;
        let details = await Product.findOne({ _id: productId })
        let combinedDetails = {
            productName: details.productName,
            productCategory: details.productCategory,
            productPrice: details.price
        };


        return res.status(200).json(combinedDetails);
        console.log(combinedDetails);
    }
    catch (error) {
        console.log('error in fetching product deatils');
        res.status(500).json({ message: "internal server error" });

    }
})

module.exports = route;