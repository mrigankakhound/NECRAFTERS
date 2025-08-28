"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, User, AlertTriangle } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [glitchActive, setGlitchActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Trigger glitch effect before redirect
        setGlitchActive(true);
        // Set authentication in localStorage
        localStorage.setItem('admin_authenticated', 'true');
        // Set session expiry (24 hours)
        const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('admin_session_expiry', expiryTime.toString());
        
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setError("Access denied. Invalid clearance code.");
        // Trigger error glitch
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 500);
      }
    } catch (err) {
      setError("Connection error. Check your clearance level.");
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 200);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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

      {/* Glitch Overlay */}
      {glitchActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-red-500 opacity-20 animate-pulse" />
          <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse delay-100" />
          <div className="absolute inset-0 bg-green-500 opacity-20 animate-pulse delay-200" />
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 font-orbitron ${
              glitchActive ? 'animate-pulse text-red-400' : 'text-green-400'
            }`}>
              👽 Restricted Access 👽
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-purple-400 font-share-tech-mono">
              NE CRAFTERS Control Panel
            </h2>
            <div className="mt-2 text-sm text-gray-400 font-share-tech-mono">
              CLASSIFIED: TOP SECRET CLEARANCE REQUIRED
            </div>
          </div>

          {/* Login Form */}
          <div className="relative">
            {/* Glowing Border Effect */}
            <div className={`absolute inset-0 rounded-lg ${
              glitchActive 
                ? 'bg-gradient-to-r from-red-500 via-purple-500 to-green-500 animate-pulse' 
                : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500'
            } blur-sm opacity-75`} />
            
            <div className="relative bg-black/80 backdrop-blur-sm border border-green-400/50 rounded-lg p-8 shadow-2xl">
              {/* TOP SECRET Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold font-share-tech-mono border border-red-400">
                  🔒 TOP SECRET
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-green-400 font-share-tech-mono">
                    <Lock className="inline w-4 h-4 mr-2" />
                    Clearance Code
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Clearance Code"
                      className={`w-full px-4 py-3 bg-black/50 border-2 rounded-lg font-share-tech-mono text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                        glitchActive 
                          ? 'border-red-400 shadow-lg shadow-red-400/50' 
                          : 'border-green-400 hover:border-green-300 focus:border-green-300 shadow-lg shadow-green-400/25'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-500/50 rounded-lg px-4 py-3">
                    <AlertTriangle size={20} />
                    <span className="text-sm font-share-tech-mono">{error}</span>
                  </div>
                )}

                {/* Access Button */}
                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={triggerGlitch}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg font-orbitron transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : glitchActive
                      ? 'bg-gradient-to-r from-red-500 via-purple-500 to-green-500 text-white shadow-lg shadow-red-400/50 animate-pulse'
                      : 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-green-400/50 hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>VERIFYING CLEARANCE...</span>
                    </div>
                  ) : (
                    "🔓 ACCESS CONTROL"
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 text-center">
                <div className="text-xs text-gray-500 font-share-tech-mono border-t border-gray-700 pt-4">
                  <div className="text-red-400 mb-1">⚠️ SECURITY NOTICE</div>
                  <div>Unauthorized access attempts will be logged and reported</div>
                  <div className="text-green-400 mt-1">Clearance Level: ALPHA-OMEGA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="text-sm text-gray-600 font-share-tech-mono">
              <div className="mb-2">🔐 Secure Connection Established</div>
              <div className="text-xs opacity-75">
                Area 51 Protocol v2.1.337 | Quantum Encryption Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
