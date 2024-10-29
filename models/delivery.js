const deliveryDetailsSchema = new Schema({
    email: { type: String, required: true},
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true }
  });
  
  module.exports = mongoose.model('DeliveryDetails', deliveryDetailsSchema);
  