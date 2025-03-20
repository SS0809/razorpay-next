import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, orderId, amount } = await req.json();

  // Generate receipt content
  const receiptContent = `
    <h1>Payment Receipt</h1>
    <p>Order ID: ${orderId}</p>
    <p>Amount: Rs ${amount}</p>
  `;

  // Send receipt via email
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Payment Receipt',
    html: receiptContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Receipt sent successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send receipt', error }, { status: 500 });
  }
}
     