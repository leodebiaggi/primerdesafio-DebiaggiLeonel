import mongoose from 'mongoose';

const productDetailsSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
});

const ProductDetails = mongoose.model('ProductDetails', productDetailsSchema);

export default ProductDetails;
