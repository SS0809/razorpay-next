"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; 
import { Button } from '@/components/ui/button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter(); 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      login(email, data.token);
      setLoading(false);
      router.push('/'); 
    } catch (error: any) {
      console.error('There was a problem with your fetch operation:', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-auto p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-auto p-2 mb-4 border border-gray-300 rounded"
      />
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
      <Button className="w-auto" type="submit">
        {loading ? '...loading' : 'Login'}
      </Button>
    </form>
  );
};

export default Login;
