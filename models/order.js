const orderSchema = new Schema({
    //if needed include supplier id
    buyer_id: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    order_date: { type: Date, default: Date.now },
    status: { type: String, required: true, enum: ['pending', 'confirmed', 'delivered'] }
  });
  
  module.exports = mongoose.model('Order', orderSchema);
  