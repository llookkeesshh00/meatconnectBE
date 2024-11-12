const route = require('express').Router();
const Product = require('../models/product');
const { User, Supplier, Buyer } = require('../models/user');
const authenticateSupplier = require('../middlewares/authmiddleware');
const contract = require('../models/contract');


route.get('/getBuyerDetails', authenticateSupplier, async (req, res) => {
  try {

    const buyerId = req.user.id;
    const buyerDetails = await Buyer.findOne({ user: buyerId }).populate('user');//from buyer table

    // Check if buyer details were found
    if (!buyerDetails) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Combine user and buyer details into a single object
    const combinedDetails = {
      id: buyerDetails.user.id,
      buyerid: buyerDetails._id,
      email: buyerDetails.user.email,
      mobile: buyerDetails.user.mobile,
      name: buyerDetails.user.name,
      role: buyerDetails.user.role,
      companyName: buyerDetails.companyName,
      address: buyerDetails.address,
      orderHistory: buyerDetails.orderHistory,
      contractsHistory: buyerDetails.contractsHistory,
    };

    // console.log(combinedDetails)
    return res.status(200).json(combinedDetails);
  } catch (error) {
    console.error('Error fetching buyer details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




route.get('/getAllProducts', authenticateSupplier, async (req, res) => {
  try {
    // Fetch all products and populate the 'supplier' field with details from the Supplier model
    const products = await Product.find()
      .populate('supplier',) // Populate supplier details like name, email, company
      .exec();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

route.get('/getBuyerProdcuts', authenticateSupplier, async (req, res) => {
  try {
    const buyerId = req.user.id;
    const buyerDetails = await Buyer.findOne({ user: buyerId })
    const buyer_id = buyerDetails._id;

    const details = await contract.find({ buyer: buyer_id });
    let newarr = []
    details.map((det) => {
      newarr.push(det.productId);
    })
    console.log(newarr);
    res.status(200).json({ ok: true, newarr })

  }
  catch (error) {
    res.status(500).json({ ok: false, error, messsage: "internal error" })
  }



})
module.exports = route;
