"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  role?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (savedUser && token) {
          const userData = JSON.parse(savedUser);
          setUser({ ...userData, token });
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user && pathname !== "/login") {
      router.push("/login");
    }
  }, [user, isLoading, pathname, router]);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      // Assuming the API returns user data and token
      const userData: User = {
        id: data.user?.id || data.id || "1",
        username: data.user?.username || data.username || username,
        name: data.user?.name || data.name || data.user?.fullName || "User",
        email: data.user?.email || data.email,
        role: data.user?.role || data.role || "admin",
        token: data.token || data.accessToken || data.access_token,
      };

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);

      setUser(userData);
      router.push("/dashboard");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);

      // Fallback for development/demo
      if (
        process.env.NODE_ENV === "development" &&
        username === "admin" &&
        password === "password"
      ) {
        const demoUser: User = {
          id: "1",
          username: "admin",
          name: "Administrator",
          email: "admin@example.com",
          role: "admin",
          token: "demo-token-" + Date.now(),
        };

        localStorage.setItem("user", JSON.stringify(demoUser));
        localStorage.setItem("token", demoUser.token);

        setUser(demoUser);
        router.push("/dashboard");
        return true;
      }

      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
