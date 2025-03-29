import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const { email, password, recaptchaToken } = await req.json();

    if (!email || !password || !recaptchaToken) {
      return NextResponse.json({ message: "Missing fields." }, { status: 400 });
    }

    // Verify reCAPTCHA with Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: recaptchaSecret || "",
        response: recaptchaToken,
      }).toString(),
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json({ message: "reCAPTCHA verification failed." }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: "Registration successful!" }, { status: 200 });
  } catch (error) {
    console.log("Error registering user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
