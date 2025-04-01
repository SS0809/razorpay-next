import connectToDatabase from '@/lib/mongodb';
import Order from '@/models/Order';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    await connectToDatabase();

    const orders = await Order.find().sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
        return NextResponse.json({ message: 'No orders found' }, { status: 404 });
    }

    return NextResponse.json({ orders }, { status: 200 });
}
