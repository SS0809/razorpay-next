import mongoose from 'mongoose';
import { type } from 'os';

const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;