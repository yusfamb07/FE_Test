"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-provider";
import { LogOut, User, Settings, Bell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const [notifications] = useState(3); // Mock notification count

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Left side - Hamburger menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className={cn(
              "hover:bg-gray-100 transition-all duration-200 relative",
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
            aria-label={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          >
            <div className="relative w-5 h-5">
              {/* Animated hamburger to X icon */}
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-300 ease-in-out",
                  sidebarOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
                )}
              >
                <Menu className="h-5 w-5" />
              </div>
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-300 ease-in-out",
                  sidebarOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"
                )}
              >
                <X className="h-5 w-5" />
              </div>
            </div>
          </Button>

          {/* Breadcrumbs or page title can go here */}
          <div className="hidden md:block">
            {/* This space can be used for breadcrumbs or search in the future */}
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                {notifications}
              </span>
            )}
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40&text=Avatar"
                    alt={user?.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {user?.name ? getInitials(user.name) : "AD"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src="/placeholder.svg?height=48&width=48&text=Avatar"
                        alt={user?.name}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                        {user?.name ? getInitials(user.name) : "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        @{user?.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        Administrator
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50 transition-colors"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
