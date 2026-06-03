"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In a real app, this calls the API. For now, we simulate.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login success
      setAuth(
        {
          id: "user_123",
          email,
          name: "John Doe",
          emailVerified: true,
          phone: "+91 9876543210",
          avatarUrl: null,
          role: "CUSTOMER",
          isActive: true,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        "mock_token_123"
      );
      
      router.push("/account");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-display text-bark text-[32px] mb-2">Sign In</h1>
      <p className="text-body text-stone mb-8">
        Welcome back! Please enter your details.
      </p>

      {error && (
        <div className="p-3 mb-6 bg-error/10 border border-error/20 text-error rounded-lg text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[14px] font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-pebble bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none"
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-[14px] font-medium text-charcoal">
              Password
            </label>
            <Link href="/auth/forgot-password" className="text-[13px] text-terracotta hover:text-bark transition-colors font-medium">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-pebble bg-white focus:border-stone focus:ring-1 focus:ring-stone transition-all outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 mt-4 flex justify-center items-center"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <p className="mt-8 text-center text-[14px] text-stone">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-charcoal font-semibold hover:text-terracotta transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
