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
import { useState } from 'react';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { useAuth } from '@/context/AuthContext';
import ReminderMessage from "@/components/ReminderMessage";
import MyOrdersSidebar from "@/components/MyOrderSidebar";
import { OrderManager } from "@/components/sidebar/OrderManager";
import { Instagram, Youtube } from "lucide-react";
import Sidebar from "@/components/sidebarmain";
import SecurePdfViewer from "@/components/SecurePDFviewer";
// const Header = () => (
//   <header className="w-full py-4 bg-gray-900 text-white text-center">
//     <h1 className="text-4xl font-bold">BLean</h1>
//   </header>
// );


const Footer = () => (
  <footer className="w-full py-4 bg-gray-900 text-white text-center mt-10">
    <p>&copy; 2025 BLean. All rights reserved.</p>

    {/* Social Media Icons */}
    <div className="flex justify-center gap-4 mt-2">
      <a 
        href="https://instagram.com/stayfitwithmayank_" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-gray-400"
      >
        <Instagram size={24} />
      </a>
      <a 
        href="https://www.youtube.com/@stayfitwithmayank" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-gray-400"
      >
        <Youtube size={24} />
      </a>
    </div>
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
    <CardHeader className="pb-8 pt-4 gap-8 bg-blue-100">
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
      image: "image3.png", // Replace with actual image path
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
  const { user, token, logout } = useAuth(); 
  const [showPdf, setShowPdf] = useState(false);
  const [showOrders ,setShowOrders] = useState(false);
  const [orderManager, setOrderManager] = useState(new OrderManager());
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

  ////////////////////////////////////////////////////////////////////////////
  // const orderManager = new OrderManager();
  async function getOrders() {
    try {
      const storedEmail = localStorage.getItem('user'); 
      if (!storedEmail) {
        console.error("No email found in localStorage");
        return [];
      }
  
      const response = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: storedEmail }),
      });
  
      const res = await response.json();
      console.log(JSON.stringify(res.user.orders));
      if (response.ok) {
        console.log("Fetched Orders:", res.user.orders);
        // Create a new instance of OrderManager
        const updatedManager = new OrderManager();
        res.user.orders.forEach((order: { orderId: string; amount: number; createdAt: string }) => {
          const createdAtDate = new Date(order.createdAt);
          const currentDate = new Date();
          const timeDifference = currentDate.getTime() - createdAtDate.getTime();
          const daysDifference = timeDifference / (1000 * 60 * 60 * 24); 
          updatedManager.addOrder({
            orderId: order.orderId,
            amount: order.amount,
            status: daysDifference > 30 ? "Finished" : "Running", 
            createdAt: createdAtDate.toLocaleString(),
          });
        });
        // Update state to trigger re-render
        setOrderManager(updatedManager);
        return res.user.orders;
      } else {
        console.error("Error:", res.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }
  
// ///////////////////////////////////////////////////////////////////////////////////
  return (
    <div className="relative min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar 
        onFetchOrders={getOrders}
        openPDF={() => setShowPdf(prev => !prev)}
        setShowOrders={setShowOrders}
        showOrders={showOrders}
        logout={logout}
      />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 px-0 lg:px-0">
        {/* Hero Section */}
        <HeroSection />

        {/* Auth Section */}
        <div className="flex flex-col items-center w-full mt-6">
          {token ? (
            <>
              <p className="text-green-700 text-sm mb-4">{user} logged in!</p>

              {/* Orders */}
              {showOrders && (
                <div className="mt-4 w-full">
                  <MyOrdersSidebar orderManager={orderManager} />
                </div>
              )}

              {/* PDF Section */}
              <div className="flex flex-col items-center justify-center w-full">
                {showPdf && <SecurePdfViewer />}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm mt-4">Already have an account?</p>
              <Login />
              <p className="text-sm mt-4">Don&apos;t have an account?</p>
              <Register />
            </>
          )}
        </div>

        {/* Testimonials */}
        <div className="mt-10">
          <Testimonials />
        </div>

        {/* Pricing Section */}
        <div className="text-center mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">Choose the plan that&apos;s right for you</h2>
          <h1 className="text-4xl font-extrabold tracking-tight mt-4">Pricing Plans</h1>

          <section className="flex flex-col sm:flex-row flex-wrap justify-center gap-8 mt-10">
            {plans.map((plan) => (
              <PricingCard key={plan.title} {...plan} />
            ))}
          </section>
        </div>

        {/* Reminder */}
        <div className="mt-10">
          <ReminderMessage />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>

  );
}