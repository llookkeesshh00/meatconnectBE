const mongoose=require('mongoose');
const Schema= mongoose.Schema;


const deliveryDetailsSchema = new Schema({
    buyer: { type: String, required: true},
    name:{type:String, required:true},
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    
  });
  
  module.exports = mongoose.model('DeliveryDetails', deliveryDetailsSchema);
  
