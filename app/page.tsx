"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from 'react';
import Image from 'next/image';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { useAuth } from '@/context/AuthContext';

const Header = () => (
  <header className="w-full py-4 bg-gray-900 text-white text-center">
    <h1 className="text-2xl font-bold">BLean</h1>
  </header>
);

const Footer = () => (
  <footer className="w-full py-4 bg-gray-900 text-white text-center mt-10">
    <p>&copy; 2025 BLean. All rights reserved.</p>
  </footer>
);

const HeroSection = () => (
  <section className="text-center py-10">
    <h2 className="text-4xl font-extrabold">Get Fit, Stay Strong</h2>
    <p className="text-lg text-gray-600 mt-2">Join BLean and transform your fitness journey today.</p>
  </section>
);

type PricingCardProps = {
  title: string;
  price: number;
  description: string;
  features: string[];
  actionLabel: string;
};

const PricingCard = ({ title, price, description, features, actionLabel }: PricingCardProps) => (
  <Card className="max-w-80 space-y-6">
    <CardHeader className="pb-8 pt-4 gap-8">
      <CardTitle>{title}</CardTitle>
      <h3 className="text-3xl font-bold my-6">Rs {price}</h3>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <CardDescription className="pt-1.5 h-12">{description}</CardDescription>
      {features.map((f, i) => (
        <span key={i} className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
          <CheckCircle2 className="text-green-500 h-4 w-4" />{f}
        </span>
      ))}
    </CardContent>
    <CardFooter className="mt-2">
      <Button className="w-full" asChild>
        <Link href={`/checkout/?amount=${price}`}>{actionLabel}</Link>
      </Button>
    </CardFooter>
  </Card>
);

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      feedback: "BLean has completely transformed my fitness journey. Highly recommend!",
      image: "image.png", // Replace with actual image path
    },
    {
      name: "Jane Smith",
      feedback: "The trainers and facilities are top-notch. I love the Pro plan!",
      image: "image2.png", // Replace with actual image path
    },
    {
      name: "Mike Johnson",
      feedback: "Affordable plans and excellent support. BLean is the best!",
      image: "image.png", // Replace with actual image path
    },
  ];

  return (
    <section className="py-10 bg-gray-100 text-center">
      <h2 className="text-4xl font-extrabold mb-6">What Our Members Say</h2>
      <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-6 max-w-sm text-left"
          >
            <div className="w-auto h-auto object-cover overflow-hidden mx-auto mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
            <p className="text-gray-600 mt-2">{testimonial.feedback}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default function Page() {
  const { token, logout } = useAuth(); 
  const plans = [
    {
      title: "Basic",
      price: 999,
      description: "Essential features you need to get started",
      features: ["Gym Access", "Personal Trainer", "Free Diet Plan"],
      actionLabel: "Get Basic",
    },
    {
      title: "Pro",
      price: 5999,
      description: "Perfect for dedicated fitness enthusiasts",
      features: ["24/7 Gym Access", "Advanced Trainer", "Customized Diet Plan"],
      actionLabel: "Get Pro",
    }
  ];
  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">Welcome to GymPay</h1>
      {!token ? (
        <>
            <>
              <p className="text-sm mt-4">
                Already have an account?{' '}
                </p>
                <Login />
                <p className="text-sm mt-4">
                Don&apos;t have an account?{' '}
                </p>
                <Register />
            </>
        </>
      ) : (
        <>
          <p className="text-green-500 text-sm mb-4">You are logged in!</p>
          <Button className="w-full" onClick={logout}>
            Logout
          </Button>
        </>
      )}
      <Header />
      <HeroSection />
      <Testimonials />
      <h2 className="text-2xl font-semibold tracking-tight">Choose the plan that&apos;s right for you</h2>
      <h1 className="text-4xl font-extrabold tracking-tight mt-10">Pricing Plans</h1>
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8 mt-10">
        {plans.map((plan) => (
          <PricingCard key={plan.title} {...plan} />
        ))}
      </section>
      <Footer />
    </div>
  );
}