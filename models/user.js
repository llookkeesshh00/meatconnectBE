const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
   email: { type: String, required: true, unique: true },  // Email is the primary key
   password: { type: String, required: true },
   mobile: { type: Number, required: true },
   name: { type: String, required: true },
   role: { type: String, enum: ['buyer', 'supplier', 'admin', 'legalTeam'], required: true }
});

//try to return adress part
const supplierSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true ,unique: true },
    email: { type: String, required: true },  // Same email as in user
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    productsHistory: [{ type: Schema.Types.ObjectId, ref: 'Product' }],  // References to products
    contractsHistory: [{ type: Schema.Types.ObjectId, ref: 'Contract' }],  // References to contracts
    orderHistory: [{ type: Schema.Types.ObjectId, ref: 'Order' }]  // References to orders
});

const buyerSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true,unique: true  },
    email: { type: String, required: true },
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    orderHistory: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    contractsHistory: [{ type: Schema.Types.ObjectId, ref: 'Contract' }]
  });
  
  module.exports = mongoose.model('Buyer', buyerSchema);
  

module.exports = {
    User: mongoose.model('User', userSchema),
    Supplier: mongoose.model('Supplier', supplierSchema),
    Buyer:mongoose.model('Buyer',buyerSchema)
};
