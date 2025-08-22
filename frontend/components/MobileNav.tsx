"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiDiscountPercentFill } from "react-icons/ri";
import { LuStore } from "react-icons/lu";
import { GrLike } from "react-icons/gr";
import { GiPerfumeBottle } from "react-icons/gi";
import { FaBath } from "react-icons/fa";
import { PiHighlighterCircleBold } from "react-icons/pi";
import { MdFace4 } from "react-icons/md";
import { User, Package, Truck, X } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const router = useRouter();

  const handleNavigation = (link: string) => {
    if (link.startsWith('/#')) {
      // Hash link - check if we're on homepage
      if (window.location.pathname === '/') {
        // Already on homepage, scroll to section
        const sectionId = link.substring(2);
        console.log('Mobile: Scrolling to section:', sectionId);
        
        // Wait a bit for any dynamic content to load
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            console.log('Mobile: Element found, scrolling...');
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.log('Mobile: Element not found, trying alternative selectors...');
            // Try alternative selectors
            const alternativeElement = document.querySelector(`[data-section="${sectionId}"]`) || 
                                    document.querySelector(`[id*="${sectionId}"]`);
            if (alternativeElement) {
              console.log('Mobile: Alternative element found, scrolling...');
              alternativeElement.scrollIntoView({ behavior: 'smooth' });
            } else {
              console.log('Mobile: No element found for section:', sectionId);
            }
          }
        }, 100);
      } else {
        // Not on homepage, navigate to homepage with hash
        console.log('Mobile: Navigating to homepage with hash:', link);
        router.push(link);
      }
    } else {
      // Regular link, navigate normally
      router.push(link);
    }
    onClose(); // Close mobile nav after navigation
  };

  const navItems = [
    { 
              name: "CRAZY DEALS", 
      icon: <RiDiscountPercentFill size={20} />,
              link: "/#crazy-deals"
    },
    { 
      name: "SHOP ALL", 
      icon: <LuStore size={20} />,
      link: "/shop"
    },
    { 
      name: "BEST SELLERS", 
      icon: <GrLike size={20} />,
      link: "/#best-sellers"
    },
    {
      name: "ABOUT US",
      icon: <GiPerfumeBottle size={20} />,
      link: "/about-us"
    },
    {
      name: "RECIPES",
      icon: <FaBath size={20} />,
      link: "/recipes"
    },
    { 
      name: "BLOG", 
      icon: <PiHighlighterCircleBold size={20} />,
      link: "/blog"
    },
    {
      name: "CONTACT US",
      icon: <MdFace4 size={20} />,
      link: "/contact-us"
    },
  ];

  const quickActions = [
    {
      name: "My Profile",
      icon: <User size={18} />,
      link: "/profile"
    },
    {
      name: "My Orders",
      icon: <Package size={18} />,
      link: "/order"
    },
    {
      name: "Track Order",
      icon: <Truck size={18} />,
      link: "/track-order"
    }
  ];

  return (
    <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Navigation Panel */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
                     {/* Header */}
           <div className={`flex items-center justify-between p-4 border-b border-gray-200 transition-all duration-500 transform ${
             isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
           }`}
           style={{ transitionDelay: '100ms' }}>
            <div className="flex items-center space-x-3">
                             <img
                 src="/images/logo.png"
                 alt="NE CRAFTERS Logo"
                 className="h-10 w-auto transition-transform duration-300 hover:scale-105"
               />

            </div>
                         <button
               onClick={onClose}
               className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
             >
               <X size={20} />
             </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Navigation
              </h3>
                             <div className="space-y-1">
                 {navItems.map((item, index) => (
                   <button
                     key={item.name}
                     onClick={() => handleNavigation(item.link)}
                     className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-300 transform hover:scale-105 hover:shadow-sm w-full text-left ${
                       isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                     }`}
                     style={{
                       transitionDelay: `${index * 50}ms`
                     }}
                   >
                     <span className="text-gray-500">{item.icon}</span>
                     <span className="font-medium text-sm">{item.name}</span>
                   </button>
                 ))}
               </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
                             <div className="space-y-1">
                 {quickActions.map((action, index) => (
                   <button
                     key={action.name}
                     onClick={() => handleNavigation(action.link)}
                     className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-300 transform hover:scale-105 hover:shadow-sm w-full text-left ${
                       isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                     }`}
                     style={{
                       transitionDelay: `${(index + navItems.length) * 50}ms`
                     }}
                   >
                     <span className="text-gray-500">{action.icon}</span>
                     <span className="font-medium text-sm">{action.name}</span>
                   </button>
                 ))}
               </div>
            </div>
          </div>

                     {/* Footer */}
           <div className={`p-4 border-t border-gray-200 transition-all duration-500 transform ${
             isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
           }`}
           style={{ transitionDelay: '400ms' }}>
            <div className="text-center">
              <p className="text-xs text-gray-500">
                © 2025 NE CRAFTERS. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
