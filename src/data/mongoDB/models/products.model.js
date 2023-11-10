import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: [String],
  owner: { type: String, default: 'admin', validate: isPremium },
});

async function isPremium(email) {
  try {
    const User = mongoose.model('User');
    const user = await User.findOne({ email });

    return user && user.role === 'premium';
  } catch (error) {
    console.error('Error al verificar si el usuario es premium:', error);
    return false; 
  }
}

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
