import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '1h',
  });

  return NextResponse.json({ user, token }, { status: 200 });
}