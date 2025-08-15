<<<<<<< HEAD
<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
=======
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from 'ui-kit';
>>>>>>> origin/fix-lint-setup

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
<<<<<<< HEAD
  const [error, setError] = useState('');
=======
  const [error, setError] = useState<string | null>(null);
>>>>>>> origin/fix-lint-setup
=======
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
>>>>>>> origin/feat/integrate-shadcn-ui
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
<<<<<<< HEAD
    setError('');

    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { accessToken } = await res.json();
        localStorage.setItem('token', accessToken);
        router.push('/dashboard'); // Redirect to a protected dashboard page
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
=======
    setError(null);

    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Failed to login');
    } else {
      // Set the token in a cookie. Expires in 1 hour, same as the JWT.
      Cookies.set('token', data.token, { expires: 1 / 24 });
      router.push('/');
>>>>>>> origin/fix-lint-setup
=======
    setError(null);
    try {
      await login(email, password);
      router.push("/"); // Redirect to dashboard on successful login
    } catch (err) {
      setError(err.message);
>>>>>>> origin/feat/integrate-shadcn-ui
    }
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 border rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
=======
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
=======
    <div className="flex items-center justify-center py-12">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
>>>>>>> origin/feat/integrate-shadcn-ui
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
<<<<<<< HEAD
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
=======
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
>>>>>>> origin/feat/integrate-shadcn-ui
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
<<<<<<< HEAD
        </CardContent>
      </Card>
>>>>>>> origin/fix-lint-setup
=======
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
>>>>>>> origin/feat/integrate-shadcn-ui
    </div>
  );
}
