import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const collection = 'User';

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  username: String,
  role: {
    type: String,
    default: 'usuario',
  },
  fromGithub: {
    type: Boolean,
    default: false,
  },
});

// Hashear password
schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const userModel = mongoose.model(collection, schema);

export default userModel;