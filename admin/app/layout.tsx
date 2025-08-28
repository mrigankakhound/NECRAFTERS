"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Sidebar from "@/components/layout/sidebar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/navbar";
import PasswordProtection from "@/components/auth/PasswordProtection";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar/navbar for login page
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <head>
        <title>NE CRAFTERS Admin</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {isLoginPage ? (
          // Show login page without protection wrapper
          children
        ) : (
          // Show protected content with sidebar/navbar
          <PasswordProtection>
            <div
              className={cn(
                "hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 transition-all duration-300",
                isSidebarCollapsed ? "md:w-[70px]" : "md:w-[270px]"
              )}
            >
              <Sidebar onCollapse={setIsSidebarCollapsed} />
            </div>
            <main
              className={cn(
                "md:pl-[270px] transition-all duration-300",
                isSidebarCollapsed && "md:pl-[70px]"
              )}
            >
              <Navbar />
              {children}
            </main>
          </PasswordProtection>
        )}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}