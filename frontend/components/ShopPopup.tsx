"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShopPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShopPopup = ({ isOpen, onClose }: ShopPopupProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus trap: focus the close button when modal opens
      closeButtonRef.current?.focus();
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Handle ESC key press
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  // Handle click outside modal to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
    >
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4"
        style={{
          animation: 'modalEnter 0.3s ease-out forwards'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 
              id="popup-title" 
              className="text-xl font-bold text-gray-900"
            >
              🎉 Welcome to Our Shop!
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Discover amazing products
            </p>
          </div>
          
          {/* Close button */}
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close popup"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div id="popup-description" className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We're excited to have you here! Explore our curated collection of premium products, 
              from authentic spices to innovative food solutions.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">✨ What's Special:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Premium quality products</li>
                <li>• Fast & secure shipping</li>
                <li>• 100% satisfaction guarantee</li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Start Shopping
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              Maybe Later
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-pulse" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.5s'}} />
      </div>
    </div>
  );
};

export default ShopPopup;