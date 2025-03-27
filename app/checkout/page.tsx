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

export default function Checkout() {
  const router = useRouter();
  const params = useSearchParams();
  const amount = params ? params.get("amount") : null;
  const [loading1, setLoading1] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = React.useState<number | null>(null);
  const { user, token } = useAuth() as { user: { email?: string } | string | null; token: string };
  const idRef = React.useRef<string | null>(null);

  // Wrap createOrderId in useCallback to avoid unnecessary re-renders
  const createOrderId = React.useCallback(async () => {
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
  }, [amount]);

  // Add missing dependencies to useEffect
  React.useEffect(() => {
    if (!amount) {
      router.replace("/");
    } else {
      createOrderId();
    }
  }, [amount, createOrderId, router]);

  // Auto redirect logic
  React.useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    
    if (successMessage) {
      setRedirectCountdown(3);
      
      redirectTimer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === 1) {
            router.push("/");
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }

    return () => {
      if (redirectTimer) clearInterval(redirectTimer);
    };
  }, [successMessage, router]);

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
        name: "Payment",
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
            setSuccessMessage(res.message || "Payment successful!");

            if (user) {
              let userEmail = "guest@example.com";

              if (typeof user === "object" && user !== null) {
                userEmail = (user as { email?: string }).email || userEmail;
              } else if (typeof user === "string" && user.includes("@")) {
                userEmail = user;
              }

              console.log("Using email:", userEmail);

              await fetch("/api/receipt", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: userEmail,
                  orderId: orderId,
                  amount: parseFloat(amount!),
                }),
              });

              // Add orderId to user (example implementation)
              await fetch("/api/update", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: userEmail,
                  orderId: orderId,
                  amount: parseFloat(amount!),
                  createdAt: Date.now(),
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
              By clicking on pay you&apos;ll purchase your plan subscription of Rs{" "}
              {amount}/month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            {successMessage && (
              <div>
                <p className="text-green-500 text-sm mb-4">{successMessage}</p>
                {redirectCountdown !== null && (
                  <p className="text-sm text-muted-foreground">
                    Redirecting to home in {redirectCountdown} seconds...
                  </p>
                )}
              </div>
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