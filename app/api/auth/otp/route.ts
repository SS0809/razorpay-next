import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface OtpData {
  code: string;
  expires: number;
}

const otpStore = new Map<string, OtpData>();

setInterval(() => {
  for (const [email, data] of Array.from(otpStore.entries())) {
    if (Date.now() > data.expires) {
      otpStore.delete(email);
    }
  }
}, 60000);

function setOtp(email: string, otp: string, expiresInSeconds = 600): void {
  otpStore.set(email, {
    code: otp,
    expires: Date.now() + (expiresInSeconds * 1000)
  });
}

function getOtp(email: string): string | null {
  const data = otpStore.get(email);
  if (!data) return null;
  
  if (Date.now() > data.expires) {
    otpStore.delete(email);
    return null;
  }
  
  return data.code;
}

function verifyOtp(email: string, otp: string): boolean {
  const storedOtp = getOtp(email);
  return storedOtp === otp;
}

async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const receiptContent = `
    <h1>One Time Password</h1>
    <p>OTP: ${otp}</p>
  `;
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER as string,
    to: email,
    subject: 'OTP for BLean',
    html: receiptContent,
  };
  
  await transporter.sendMail(mailOptions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, otp } = body;
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Valid email is required' }, 
        { status: 400 }
      );
    }
    
    if (action === 'send') {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(email, newOtp);
      console.log(`Stored OTP for ${email}: ${newOtp}`);
      await sendOtpEmail(email, newOtp);
      return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    } 
    else if (action === 'verify') {
      if (!otp || typeof otp !== 'string') {
        return NextResponse.json(
          { message: 'OTP is required' }, 
          { status: 400 }
        );
      }
      
      console.log(`Verifying OTP for ${email}: ${otp}`);
      console.log(`Stored OTP: ${getOtp(email)}`);
      
      const isValid = verifyOtp(email, otp);
      
      if (isValid) {
        otpStore.delete(email);
        return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Invalid OTP' }, { status: 401 });
      }
    }
    else {
      return NextResponse.json(
        { message: 'Invalid action. Use "send" or "verify"' }, 
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('OTP API Error:', error);
    return NextResponse.json(
      { message: 'Operation failed', error: (error as Error).message }, 
      { status: 500 }
    );
  }
}
