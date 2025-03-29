import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, orderId, amount, createdAt } = await req.json();

    if (!email || !orderId || !amount || !createdAt) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $push: { orders: { orderId , email , amount, createdAt } } },
      { new: true, upsert: true } // Return the updated user and create a new one if not found
    );

    const newOrder = await new Order({
      orderId,
      email,
      amount,
      createdAt
    }).save();

    return NextResponse.json({ message: 'User updated successfully', user: updatedUser ,order:newOrder}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error'}, { status: 500 });
  }
}
