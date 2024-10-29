const contractSchema = new Schema({
    buyer: { type: Schema.Types.ObjectId, ref: 'Buyer', required: true },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    terms: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    availableQuantity: { type: Number, required: true }
  });
  
  module.exports = mongoose.model('Contract', contractSchema);
  