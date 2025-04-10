"use client";
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from 'react';
import { useEffect, useState } from 'react';
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useAuth } from '@/context/AuthContext';
import ReminderMessage from "@/components/ReminderMessage";
import MyOrdersSidebar from "@/components/MyOrderSidebar";
import { OrderManager } from "@/components/sidebar/OrderManager";
import { Instagram, Youtube } from "lucide-react";
import Sidebar from "@/components/sidebarmain";
import SecurePdfViewer from "@/components/SecurePDFviewer";
import AuthComponent from "@/components/AuthComponent";
// const Header = () => (
//   <header className="w-full py-4 bg-gray-900 text-white text-center">
//     <h1 className="text-4xl font-bold">BLean</h1>
//   </header>
// );



const Footer = () => (
  <footer className="w-full py-6 bg-gray-900 text-white text-center mt-10">
    <p className="mb-2">&copy; 2025 BLean. All rights reserved.</p>

    {/* Navigation Links */}
    <div className="flex justify-center gap-6 text-sm mb-2">
      <Link href="/refund-policy" className="hover:text-gray-400">
        Refund Policy
      </Link>
      <Link href="/terms-and-conditions" className="hover:text-gray-400">
        Terms & Conditions
      </Link>
      <Link href="/privacy-policy" className="hover:text-gray-400">
        Privacy Policy
      </Link>
      <Link href="/contact-us" className="hover:text-gray-400">
        Contact Us  : 7000413579
      </Link>
    </div>

    {/* Social Media Icons */}
    <div className="flex justify-center gap-4 mt-2">
      <a 
        href="https://instagram.com/stayfitwithmayank_" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-gray-400"
      >
        <Instagram size={22} />
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
  <section className="text-center py-10 text-white">
    <h2 className="text-4xl font-extrabold">Join our fitness programme for </h2>
    <h2 className="text-4xl font-extrabold">lasting health and vilatity </h2>
    <p className="text-lg text-gray-600 mt-2">transform your sedentary lifestyle with expert guidance </p>
  </section>
);

type PricingCardProps = {
  title: string;
  price: number;
  duration: number;
  discountrate: number;
  description: string;
  features: string[];
  unavailableFeatures: string[];
  actionLabel: string;
};

const PricingCard = ({ title, price, description, features, actionLabel }: PricingCardProps) => (
  <Card className="max-w-80 space-y-6 text-black">
    <CardHeader className="pb-8 pt-4 gap-8 bg-blue-400">
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
const SimplePricingCard = ({ 
  title = "Standard Plan", 
  price = 49, 
  duration= 1,
  discountrate= 0,
  description = "", 
  features = [], 
  unavailableFeatures = [],
  actionLabel = "Choose Plan" 
}: PricingCardProps) => (
  <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{title}</h5>
    <div className="flex items-baseline text-gray-900 dark:text-white">
      <span className="text-1xl font-semibold">Rs.</span>
      <span className="text-3xl font-extrabold tracking-tight line-through text-gray-400">{price}</span>
      <span className="text-3xl font-extrabold tracking-tight text-green-500 ms-4">{price - (price * discountrate / 100)}</span>
      <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/{duration} months</span>
    </div>
    {description && <p className="text-gray-500 dark:text-gray-400 my-4">{description}</p>}
    
    <ul role="list" className="space-y-5 my-7">
      {features.length > 0 && features.map((item, i) => (
        <li key={i} className="flex items-center">
          <svg className="shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">{item}</span>
        </li>
      ))}
      {unavailableFeatures.length > 0 && unavailableFeatures.map((item, i) => (
        <li key={i} className="flex line-through decoration-gray-500">
          <svg className="shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500 ms-3">{item}</span>
        </li>
      ))}
    </ul>
    {useAuth().user ? (
    <button 
      onClick={() => window.location.href =  `/checkout/?amount=${price}`} 
      type="button" 
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
    >{actionLabel}</button>
      ) : (
        <button 
      onClick={() => window.location.href =  '/'} 
      type="button" 
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
    >{actionLabel}</button>
      )}
  </div>
);
const Card3D = () => {
  return (
    <CardContainer className="inter-var">
    <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
      <CardItem
        translateZ="50"
        className="text-xl font-bold text-neutral-600 dark:text-white"
      >
        Make things float in air
      </CardItem>
      <CardItem
        as="p"
        translateZ="60"
        className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
      >
        Hover over this card to unleash the power of CSS perspective
      </CardItem>
      <CardItem translateZ="100" className="w-full mt-4">
        <Image
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          height="1000"
          width="1000"
          className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
          alt="thumbnail"
        />
      </CardItem>
      <div className="flex justify-between items-center mt-20">
        <CardItem
          translateZ={20}
          as={Link}
          href="https://twitter.com/mannupaaji"
          target="__blank"
          className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
        >
          Try now →
        </CardItem>
        <CardItem
          translateZ={20}
          as="button"
          className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
        >
          Sign up
        </CardItem>
      </div>
    </CardBody>
  </CardContainer>
  );
};

interface Testimonial {
  _id?: string;
  name: string;
  feedback: string;
  image: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      setLoading(true);
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        } else {
          console.error('Failed to fetch testimonials');
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    setSlideDirection('right');
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setSlideDirection('left');
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    if (index > currentIndex) {
      setSlideDirection('right');
    } else if (index < currentIndex) {
      setSlideDirection('left');
    }
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // Fallback for empty testimonials
  if (!testimonials.length) {
    return (
      <div className="flex justify-center items-center py-10 bg-gray-900 text-gray-300">
        <p>No testimonials available at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 py-20 px-8 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-white mb-8">
          What Our Clients Say
        </h2>

        {/* Carousel container */}
        <div className="relative overflow-hidden bg-gray-800 rounded-lg shadow-xl">
          {/* Testimonial slides */}
          <div className="relative h-auto min-h-96 md:min-h-128">
            {testimonials.map((testimonial, index) => {
              // Determine the position classes based on index and slide direction
              let positionClasses = '';

              if (index === currentIndex) {
                positionClasses = 'opacity-100 translate-x-0';
              } else if (slideDirection === 'right') {
                positionClasses = index < currentIndex || (currentIndex === 0 && index === testimonials.length - 1)
                  ? 'opacity-0 -translate-x-full' // Slide exits to the left
                  : 'opacity-0 translate-x-full';  // Slide enters from the right
              } else if (slideDirection === 'left') {
                positionClasses = index > currentIndex || (currentIndex === testimonials.length - 1 && index === 0)
                  ? 'opacity-0 translate-x-full'  // Slide exits to the right
                  : 'opacity-0 -translate-x-full'; // Slide enters from the left
              } else {
                // Initial state or when using indicators
                positionClasses = index < currentIndex ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full';
              }

              return (
                <div
                  key={testimonial._id || index}
                  className={`absolute top-0 left-0 w-full h-auto transition-all duration-500 ease-in-out transform ${positionClasses}`}
                >
                  <div className="flex flex-col md:flex-row h-full p-6 md:p-10">
                    <div className="flex-shrink-0 flex justify-center items-center mb-4 md:mb-0 md:mr-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-48 h-48 object-cover shadow-lg"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <p className="text-gray-300 italic mb-4 text-lg">{testimonial.feedback}</p>
                      <h3 className="font-bold text-white text-xl">{testimonial.name}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center z-20 pl-4">
            <button
              onClick={prevSlide}
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full shadow-lg focus:outline-none transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center z-20 pr-4">
            <button
              onClick={nextSlide}
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full shadow-lg focus:outline-none transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-blue-500" : "bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};



const PricingSection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  interface Plan {
    _id?: string;
    title: string;
    duration: number;
    discountrate: number;
    price: number;
    description: string;
    features: string[];
    unavailableFeatures: string[];
    actionLabel: string;
  }

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      try {
        const response = await fetch('/api/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
          setLoading(false);
        } else {
          console.error('Failed to fetch plans');
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    }

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <section className="py-10 dark text-center text-white" style={{ margin: '5%' }}>
      <div className="text-center mt-1">
        <h2 className="text-2xl font-semibold tracking-tight">Choose the plan that&apos;s right for you</h2>
        <h1 className="text-4xl font-extrabold tracking-tight mt-4">Pricing Plans</h1>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-8 mt-10">
          {plans.map((plan: Plan) => (
            <SimplePricingCard key={plan._id} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default function Page() {
  const { user, token, logout } = useAuth(); 
  const [showPdf, setShowPdf] = useState(false);
  const [showOrders ,setShowOrders] = useState(false);
  const [authbar ,setAuthBar] = useState(false);
  const [orderManager, setOrderManager] = useState(new OrderManager());
  const plans = [
    {
      title: "Basic",
      price: 999,
      description: "Essential features you need to get started",
      features: ["Gym Access", "Personal Trainer", "Free Diet Plan"],
      unavailableFeatures: ["Stop1"],
      actionLabel: "Get Basic",
    },
    {
      title: "Pro",
      price: 5999,
      description: "Perfect for dedicated fitness enthusiasts",
      unavailableFeatures: ["Stop1"],
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
    <div className="relative min-h-screen bg-white 
    select-none">
      {/* Sidebar */}
      <Sidebar 
        onFetchOrders={getOrders}
        openPDF={() => setShowPdf(prev => !prev)}
        setShowOrders={setShowOrders}
        showOrders={showOrders}
        logout={logout}
        setAuthBar={setAuthBar}
        token={token}
      />
      {/* Main Content */}
      <main className="lg:ml-64 pt-20 px-0 lg:px-0 bg-gray-800 ">
        {/* Hero Section */}
        <HeroSection />

        {/* Auth Section */}
        <div className="flex flex-col items-center w-full mt-6">
          {token ? (
            <>
                <div 
                id="toast-default" 
                className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-black rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800 dark" 
                role="alert"
                style={{ animation: "fadeOut 3s forwards" }}
                >
                  <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"/>
                    </svg>
                    <span className="sr-only">Fire icon</span>
                  </div>
                  <div className="ms-3 text-sm font-normal">{user} logged in!</div>
                </div>
                <style jsx>{`
                @keyframes fadeOut {
                  0% {
                  opacity: 1;
                  }
                  100% {
                  opacity: 0;
                  display: none;
                  }
                }
                `}</style>

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
            {authbar && (
              <div 
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50" 
                onClick={() => setAuthBar(false)} 
              >
                <div 
                  className="max-w-md w-full mx-4 animate-in fade-in duration-300"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <AuthComponent />
                </div>
              </div>
            )}
            </>
          )}
        </div>
        {/* Testimonials */}
        <div className="mt-10">
          <Testimonials />
        </div>

        {/* Pricing Section */}
        <PricingSection />

        {/* Reminder */}
        <div className="mt-10 m-10">
          <ReminderMessage />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>

  );
}