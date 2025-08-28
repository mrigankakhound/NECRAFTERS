"use client";

import { Key, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ChangePasswordModal from "../modals/ChangePasswordModal";

const Navbar = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_session_expiry');
    // Redirect to login (now at root path)
    window.location.href = '/';
  };

  return (
    <div className="flex items-center p-4 border-b bg-gray-900 text-white">
      <div className="flex-1">
        <h2 className="text-lg font-semibold">Welcome, Admin</h2>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Change Password Button */}
        <Button 
          variant="outline" 
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          onClick={handleChangePassword}
        >
          <Key className="h-4 w-4 mr-2" />
          Change Password
        </Button>
        
        {/* Logout Button */}
        <Button 
          variant="outline" 
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white border-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
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
