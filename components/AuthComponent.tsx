"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      setSuccessMessage("Registration successful! Please log in.");
      setLoading(false);
      
      // Switch to login tab after successful registration
      setTimeout(() => {
        switchTab();
      }, 2000);
      
    } catch (error: any) {
      console.error("There was a problem with your fetch operation:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h5 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-4">
        Create an account
      </h5>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-900 dark:text-white">
            Email address
          </label>
          <input
            type="email"
            id="register-email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          />
        </div>
        
        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <input
            type="password"
            id="register-password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          />
        </div>
        
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
        
        <Button className="w-full" type="submit">
          {loading ? "Processing..." : "Register"}
        </Button>
        
        <p className="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
          Already have an account?{" "}
          <button 
            type="button" 
            onClick={switchTab} 
            className="text-blue-700 hover:underline dark:text-blue-500"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthComponent;