"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Register from "@/components/Register";

export default function Checkout() {
  const router = useRouter();
  const params = useSearchParams();
  const amount = params ? params.get("amount") : null;
  const [loading1, setLoading1] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [showRegister, setShowRegister] = React.useState(false);
  const { user, token, login, logout } = useAuth();
  const idRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!amount) {
      router.replace("/");
    }
    createOrderId();
  }, []);

  const createOrderId = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount!) * 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order. Please try again.");
      }

      const data = await response.json();
      const id = data.orderId;
      idRef.current = id;
      setLoading1(false);
    } catch (error: any) {
      console.error("There was a problem with your fetch operation:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setLoading1(false);
    }
  };

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const orderId = idRef.current;
    if (!orderId) {
      setErrorMessage("Order ID is missing. Please refresh the page.");
      setLoading(false);
      return;
    }

    try {
      const options = {
        key: process.env.key_id,
        amount: parseFloat(amount!) * 100,
        currency: "INR",
        name: "Payment", // business name
        description: "Payment",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });

          const res = await result.json();
          if (res.isOk) {
            setSuccessMessage(res.message || "Payment successful! "+  user);

            if (user) {
              let userEmail = "guest@example.com"; // Default fallback
              
              // Handle different possible user formats
              if (typeof user === 'object' && user !== null) {
                // If user is already an object
                userEmail = user.email || userEmail;
              } else if (typeof user === 'string') {
                // Try to determine if it's a JSON string
                try {
                  if (user.startsWith('{') && user.endsWith('}')) {
                    const parsedUser = JSON.parse(user);
                    userEmail = parsedUser.email || userEmail;
                  } else if (user.includes('@')) {
                    // If it's directly an email string
                    userEmail = user;
                  }
                } catch (e) {
                  console.error("Error parsing user data:", e);
                }
              }
              
              console.log("Using email:", userEmail);
              
              await fetch("/api/receipt", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  email: userEmail,
                  orderId: orderId,
                  amount: parseFloat(amount!),
                }),
              });
            } else {
              console.warn("User is not logged in, skipping receipt email");
            }
          } else {
            setErrorMessage(res.message || "Payment verification failed.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        setErrorMessage(response.error.description || "Payment failed. Please try again.");
      });

      setLoading(false);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while processing the payment.");
      setLoading(false);
    }
  };

  if (loading1)
    return (
      <div className="container h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin h-20 w-20 text-primary" />
      </div>
    );

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <section className="container h-screen flex flex-col justify-center items-center gap-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          Checkout
        </h1>
        <Card className="max-w-[25rem] space-y-8">
          <CardHeader>
            <CardTitle className="my-4">Continue</CardTitle>
            <CardDescription>
              By clicking on pay you'll purchase your plan subscription of Rs{" "}
              {amount}/month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm mb-4">{successMessage}</p>
            )}
            <form onSubmit={processPayment}>
              <Button className="w-full" type="submit">
                {loading ? "...loading" : "Pay"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground underline underline-offset-4">
              Please read the terms and conditions.
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Go to Home
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}