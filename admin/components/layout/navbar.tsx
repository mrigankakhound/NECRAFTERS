"use client";

import { Settings, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import ChangePasswordModal from "../modals/ChangePasswordModal";

const Navbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex items-center p-4 border-b bg-gray-900 text-white">
      <div className="flex-1">
        <h2 className="text-lg font-semibold">Welcome, Admin</h2>
      </div>
      
      {/* Settings Dropdown */}
      <div className="relative" ref={settingsRef}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/10 bg-blue-600 px-3"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <Settings className="h-5 w-6 text-white" />
        </Button>
        
        {/* Dropdown Menu */}
        {isSettingsOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
            {/* Change Password Option */}
            <button
              onClick={handleChangePassword}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors duration-150"
            >
              <Key className="h-4 w-4 text-gray-500" />
              <span>Change Password</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default Navbar;
