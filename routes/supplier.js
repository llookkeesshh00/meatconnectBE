const route = require('express').Router();
const Product = require('../models/product');
const { User, Supplier, Buyer } = require('../models/user');


const authenticateSupplier = require('../middlewares/authmiddleware');
const user = require('../models/user');

route.post('/uploadProduct', authenticateSupplier, async (req, res) => {
  try {
    const { productCategory, productName, price } = req.body;
    const user_id = req.user.id;

    const supplier = await Supplier.findOne({ user: user_id });

    const product = new Product({
      supplier: supplier._id, // Use the supplier's ID from the Supplier collection
      productCategory,
      productName,
      price,
    });


    const savedProduct = await product.save();


    let abc = await Supplier.findOneAndUpdate(
      { _id: supplier._id }, // Match supplier by their ID
      { $push: { productsHistory: savedProduct._id } }, // Push the product ID into productsHistory
      { new: true } // Return the updated document
    );

    // Respond with the saved product details
    res.status(201).json({ message: 'Product uploaded successfully', product: savedProduct });
  } catch (err) {
    console.error('Error uploading product:', err);
    res.status(500).json({ error: 'Server error while uploading product' });
  }
});


route.get('/getSupplierDetails', async (req, res) => {

  const { supplierId } = req.query
  const supplierDetails = await Supplier.findOne({ _id: supplierId })//from supplier table
  const userdetails = await User.findOne({ _id: supplierDetails.user })//from supplier table

  if (!supplierDetails) {
    return res.status(404).json({ message: 'Buyer not found' });
  }

  const combinerDetails = {
    id: userdetails._id,
    
    supplierid: supplierDetails._id,
    email: userdetails.email,
    mobile: userdetails.mobile,
    name: userdetails.name,
    role: userdetails.role,
    companyName: supplierDetails.companyName,
    address: supplierDetails.address,
    productsHistory: supplierDetails.productsHistory,
    contractsHistory: supplierDetails.contractsHistory,
    orderHistory: supplierDetails.orderHistory,
  }
  console.log(combinerDetails)
  return res.status(200).json(combinerDetails);



})



route.get('/getProducts', authenticateSupplier, async (req, res) => {
  const user_id = req.user.id; // The user ID from the JWT

  try {
    const supplier_id = await Supplier.find({ user: user_id })
    const products = await Product.find({ supplier: supplier_id });

    if (!products) {
      return res.status(404).json({ message: 'No products found for this supplier' });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = route;
