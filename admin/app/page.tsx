"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-pulse blur-xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 animate-pulse delay-1000 blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-15 animate-pulse delay-2000 blur-xl" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="text-center relative z-10">
        {/* Main Content Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 relative overflow-hidden">
          {/* Glowing Border Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-20 blur-sm" />
          
          {/* Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-full flex items-center justify-center mb-8 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <Lock className="w-12 h-12 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            Welcome to Admin Dashboard
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-200 mb-8">
            Redirecting to login in 3 seconds...
          </p>
          
          {/* Loading Animation */}
          <div className="flex justify-center space-x-3 mb-8">
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce delay-200" />
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300">System Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500" />
              <span className="text-blue-300">Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000" />
              <span className="text-purple-300">Connected</span>
            </div>
          </div>
          
          {/* Sparkles */}
          <div className="flex items-center justify-center mt-6 space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="text-yellow-300 text-sm font-medium">NE CRAFTERS Admin Portal</span>
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse delay-300" />
          </div>
        </div>
        
        {/* Redirect Arrow */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-white/60 hover:text-white transition-colors duration-300">
            <span className="text-sm">Going to login</span>
            <ArrowRight className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
