"use client";

<<<<<<< HEAD
import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from 'ui-kit';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
=======
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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();
  const router = useRouter();
>>>>>>> origin/feat/integrate-shadcn-ui

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
<<<<<<< HEAD
    setSuccess(null);

    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Failed to register');
    } else {
      setSuccess('Registration successful! You can now log in.');
      // Maybe redirect to login page after a delay
=======
    try {
      await signup(name, email, password);
      router.push("/login?signup=success"); // Redirect to login page after successful signup
    } catch (err) {
      setError(err.message);
>>>>>>> origin/feat/integrate-shadcn-ui
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
=======
    <div className="flex items-center justify-center py-12">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Max Robinson"
>>>>>>> origin/feat/integrate-shadcn-ui
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
<<<<<<< HEAD
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
=======
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
<<<<<<< HEAD
            {success && <p className="text-sm text-green-500">{success}</p>}
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
=======
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
>>>>>>> origin/feat/integrate-shadcn-ui
        </CardContent>
      </Card>
    </div>
  );
}
