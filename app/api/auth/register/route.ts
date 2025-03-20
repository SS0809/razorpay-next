import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'User registration failed', error }, { status: 500 });
  }
}