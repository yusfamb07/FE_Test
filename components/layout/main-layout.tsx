"use client"

import { cn } from "@/lib/utils"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default open on desktop
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile and handle initial sidebar state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)

      // On mobile, sidebar should be closed by default
      // On desktop, sidebar should be open by default
      if (mobile) {
        setSidebarOpen(false)
      } else {
        // Check localStorage for desktop sidebar preference
        const savedState = localStorage.getItem("sidebar-open")
        if (savedState !== null) {
          setSidebarOpen(JSON.parse(savedState))
        } else {
          setSidebarOpen(true) // Default open on desktop
        }
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Save sidebar state to localStorage for desktop
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebar-open", JSON.stringify(sidebarOpen))
    }
  }, [sidebarOpen, isMobile])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [sidebarOpen, isMobile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">Memuat aplikasi...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={isMobile} />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          // Desktop: adjust margin based on sidebar state
          // Mobile: always full width
          isMobile ? "ml-0" : sidebarOpen ? "lg:ml-64" : "lg:ml-0",
        )}
      >
        <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="py-6 px-4 lg:px-8 min-h-[calc(100vh-73px)]">{children}</main>
      </div>
    </div>
  )
}
