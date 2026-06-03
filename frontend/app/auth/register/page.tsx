"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Registration successful, redirect to login
      router.push("/auth/login?registered=true");
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full">
      <h1 className="text-display text-bark text-[32px] mb-2">Create Account</h1>
      <p className="text-body text-stone mb-8">
        Join Pearl Store for faster checkout and exclusive offers.
      </p>

      {error && (
        <div className="p-3 mb-6 bg-error/10 border border-error/20 text-error rounded-lg text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-[14px] font-medium text-charcoal">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-pebble bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-[14px] font-medium text-charcoal">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-pebble bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-[14px] font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-pebble bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-[14px] font-medium text-charcoal">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-pebble bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none"
            placeholder="Min. 8 characters"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 mt-4 flex justify-center items-center"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
        </button>
      </form>

      <p className="mt-8 text-center text-[14px] text-stone">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-charcoal font-semibold hover:text-terracotta transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
