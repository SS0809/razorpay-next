"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Register = () => {
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
      router.push("/"); // Redirect to the home page or login page
    } catch (error: any) {
      console.error("There was a problem with your fetch operation:", error);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
      <Button className="w-full" type="submit">
        {loading ? "...loading" : "Register"}
      </Button>
    </form>
  );
};

export default Register;