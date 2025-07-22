"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import {
  BarChart3,
  FileText,
  Settings,
  X,
  Car,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  {
    name: "Laporan Lalin",
    icon: FileText,
    submenu: [{ name: "Laporan Per Hari", href: "/reports" }],
  },
  { name: "Master Gerbang", href: "/gates", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
}

export function Sidebar({ isOpen, setIsOpen, isMobile }: SidebarProps) {
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(["Laporan Lalin"]);
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setIsOpen]);

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isSubmenuOpen = (menuName: string) => openSubmenus.includes(menuName);

  const isActiveSubmenu = (submenu: any[]) => {
    return submenu.some((item) => pathname === item.href);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out",

          isOpen
            ? "translate-x-0 shadow-lg lg:shadow-none"
            : "-translate-x-full",
          !isMobile && isOpen && "lg:shadow-none",
          !isMobile && !isOpen && "lg:shadow-lg"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  Sistem Tol
                </h1>
                <p className="text-sm text-gray-500 truncate">Management</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              if (item.submenu) {
                const isSubmenuActive = isActiveSubmenu(item.submenu);
                const isOpen = isSubmenuOpen(item.name);

                return (
                  <Collapsible
                    key={item.name}
                    open={isOpen}
                    onOpenChange={() => toggleSubmenu(item.name)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 text-left hover:bg-gray-50",
                          isSubmenuActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <div className="flex items-center min-w-0">
                          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                          )}
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1">
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const isActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={cn(
                                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group",
                                isActive
                                  ? "bg-blue-100 text-blue-700 border-l-2 border-blue-500"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              )}
                              onClick={handleLinkClick}
                            >
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full mr-3 flex-shrink-0 transition-colors duration-200",
                                  isActive
                                    ? "bg-blue-500"
                                    : "bg-gray-300 group-hover:bg-gray-400"
                                )}
                              />
                              <span className="truncate">{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={handleLinkClick}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
