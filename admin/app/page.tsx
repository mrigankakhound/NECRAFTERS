"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Space Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Floating UFOs */}
        <div className="absolute top-20 left-20 animate-pulse">
          <div className="w-8 h-4 bg-gradient-to-r from-green-400 to-purple-500 rounded-full opacity-60" />
        </div>
        <div className="absolute top-40 right-32 animate-pulse delay-1000">
          <div className="w-6 h-3 bg-gradient-to-r from-purple-400 to-green-500 rounded-full opacity-40" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-pulse delay-2000">
          <div className="w-10 h-5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full opacity-50" />
        </div>
      </div>

      <div className="text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-orbitron text-green-400">
          👽 NE CRAFTERS 👽
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6 font-share-tech-mono text-purple-400">
          ADMIN CONTROL CENTER
        </h2>
        <div className="text-lg text-gray-400 font-share-tech-mono mb-8">
          <div className="mb-2">🔐 Initializing Security Protocols...</div>
          <div className="text-sm opacity-75">Redirecting to Access Control in 2 seconds</div>
        </div>
        
        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
