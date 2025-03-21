import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: String,
  amount: Number,
  createdAt: Date,
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  orders: [OrderSchema],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
