const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    productCategory: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true }
  });
  
  module.exports = mongoose.model('Product', productSchema);
  