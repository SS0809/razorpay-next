"use client";

import React, { useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReCAPTCHA from "react-google-recaptcha";

const AuthComponent = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const router = useRouter();

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      {/* Custom tab navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex-1 py-2 px-4 text-center ${
            activeTab === "login"
              ? "border-b-2 border-blue-500 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${
            activeTab === "register"
              ? "border-b-2 border-blue-500 text-blue-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>
      
      {/* Tab content */}
      {activeTab === "login" ? (
        <LoginForm switchTab={() => setActiveTab("register")} />
      ) : (
        <RegisterForm switchTab={() => setActiveTab("login")} />
      )}
    </div>
  );
};

const LoginForm = ({ switchTab }: { switchTab: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      login(email, data.token);
      setLoading(false);
      router.push("/");
    } catch (error: any) {
      console.error("There was a problem with your fetch operation:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-4">
        Sign in to your account
      </h5>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
             Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          />
        </div>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button type="submit" className="w-full">
          {loading ? "Loading..." : "Login"}
        </Button>

        <p className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
          Not registered?{" "}
          <button 
            type="button" 
            onClick={switchTab} 
            className="text-blue-700 hover:underline dark:text-blue-500"
          >
            Create an account
          </button>
        </p>
      </form>
    </div>
  );
};


const RegisterForm = ({ switchTab }: { switchTab: () => void }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const validateEmail = () => {
    if (!email) {
      setErrorMessage("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateEmail() || !recaptchaToken) {
      setErrorMessage("Please complete the reCAPTCHA verification.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", email, recaptchaToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP. Try again.");
      }

      setSuccessMessage("OTP sent to your email.");
      setStep("otp");
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP.");
      }

      setSuccessMessage("OTP verified. Set your password.");
      setStep("password");
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, recaptchaToken }), // Include the token
      });
    
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }
    
      setSuccessMessage("Registration successful. You can now login.");
      switchTab();
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }    
  };

  return (
    <div>
      <h5 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-4">
        Create an account
      </h5>

      {step === "email" && (
        <>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6Lc3Y8cbAAAAAJ1Jj5nZ"}
            onChange={(token) => setRecaptchaToken(token)}
          />
          <button onClick={handleSendOTP} disabled={loading} className="w-full mt-2">
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
          <button onClick={handleVerifyOTP} disabled={loading} className="w-full mt-2">
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </>
      )}

      {step === "password" && (
        <>
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
          />
          <button onClick={handleRegister} disabled={loading} className="w-full mt-2">
            {loading ? "Registering..." : "Register"}
          </button>
        </>
      )}

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
    </div>
  );
};



export default AuthComponent;