"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

import {
  Loader2,
  Car,
  RouteIcon as Highway,
  MapPin,
  BarChart3,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast({
        title: "Validasi Error",
        description: "Username dan password harus diisi",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login Success",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Gagal",
          description: "Username atau password salah",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* App Logo */}
          <div className="text-center">
            <div className="mx-auto w-auto h-20 0 rounded-lg flex items-center justify-center mb-8">
              <div className="flex items-center gap-2">
                <Car className="h-10 w-10 text-blue-600" />
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-800">
                    Management Tol
                  </div>
                  <div className="text-xs text-gray-600">SYSTEM</div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Selamat Datang
            </h2>
            <p className="text-gray-600">Masuk ke sistem manajemen tol</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                placeholder="Masukkan username"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 pr-10"
                  placeholder="Masukkan password"
                  disabled={isLoading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-12 w-12 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration/Background */}
      <div className="hidden lg:flex flex-[2] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <img src="/loginBG.jpg" className="object-cover" alt="" />
      </div>
    </div>
  );
}
