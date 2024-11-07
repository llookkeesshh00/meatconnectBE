const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const contractSchema = new Schema({
    buyer: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    startDate: { type: Date, default: Date.now },
    period:{  type:Number,required:true},
    endDate: { type: Date},
    expires:{type:Boolean,default:false},
    paymentType:{type:String},
    paymentMode:{type:String}

  });
  
  module.exports = mongoose.model('Contract', contractSchema);
  