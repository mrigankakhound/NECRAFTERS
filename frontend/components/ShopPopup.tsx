"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PopupContent {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
}

interface ApiResponse {
  success: boolean;
  data?: PopupContent;
  error?: string;
}

export default function ShopPopup() {
  const [open, setOpen] = useState(false);
  const [popupContent, setPopupContent] = useState<PopupContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndShowPopup = async () => {
      console.log("ShopPopup: Starting to fetch popup...");
      try {
        setLoading(true);
        
        // Temporarily disable localStorage check for debugging
        // const hasSeenPopup = localStorage.getItem('hasSeenShopPopup');
        // if (hasSeenPopup) {
        //   console.log("ShopPopup: User has already seen popup");
        //   return;
        // }
        
        console.log("ShopPopup: Fetching from API...");
        const response = await fetch('/api/shop-popup');
        console.log("ShopPopup: API Response status:", response.status);
        
        const responseText = await response.text();
        console.log("ShopPopup: Raw API response:", responseText);
        
        const result: ApiResponse = JSON.parse(responseText);
        console.log("ShopPopup: Image URL from response:", result.data?.imageUrl);
        
        // Log the full image URL for debugging
        if (result.data?.imageUrl) {
          const fullUrl = result.data.imageUrl.startsWith('http')
            ? result.data.imageUrl
            : `${window.location.origin}${result.data.imageUrl}`;
          console.log("ShopPopup: Full image URL will be:", fullUrl);
        }
        console.log("ShopPopup: Parsed API response:", result);
        
        if (result.success && result.data) {
          console.log("ShopPopup: Setting popup content:", result.data);
          setPopupContent(result.data);
          setOpen(true);
          // localStorage.setItem('hasSeenShopPopup', 'true');
        } else {
          console.log("ShopPopup: No valid popup data in response");
        }
      } catch (error) {
        console.error('ShopPopup: Error fetching popup:', error);
      } finally {
        setLoading(false);
        console.log("ShopPopup: Finished fetching");
      }
    };

    fetchAndShowPopup();
  }, []);

  if (loading || !popupContent) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-describedby="popup-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">{popupContent.title}</DialogTitle>
          {popupContent.imageUrl && (
            <div className="w-full h-[200px] overflow-hidden rounded-lg mb-4 bg-gray-100">
              {/* Regular img tag for testing */}
              <img
                src={popupContent.imageUrl}
                alt={popupContent.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("ShopPopup: Image failed to load in component");
                  console.log("ShopPopup: Image URL:", popupContent.imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => console.log("ShopPopup: Image loaded successfully in component")}
                style={{ maxWidth: '100%' }}
              />
            </div>
          )}
          <DialogDescription id="popup-description" className="text-sm text-muted-foreground">
            {popupContent.description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}