// app/api/verifyadmin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import { Admin } from '@/models/Admin';

export async function POST(req: NextRequest) {
    try {
      await connectToDatabase();
      
      const { email } = await req.json();
      const user = await Admin.findOne({ email }).exec();

      if (user) {
        return NextResponse.json({ authorized: true }, { status: 200 });
      } else {
        return NextResponse.json({ authorized: false }, { status: 403 });
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      return NextResponse.json({ error: 'Failed to verify user' }, { status: 500 });
    }
}