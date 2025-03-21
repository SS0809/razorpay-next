import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    await connectToDatabase();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
}
