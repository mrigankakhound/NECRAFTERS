/* eslint no-use-before-define: 0 */
"use client";
import {
  User,
  Menu,
  Package,
  Truck,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { RiDiscountPercentFill } from "react-icons/ri";
import { LuStore } from "react-icons/lu";
import { GrLike } from "react-icons/gr";
import { GiPerfumeBottle } from "react-icons/gi";
import { FaBath } from "react-icons/fa";
import { PiHighlighterCircleBold } from "react-icons/pi";
import { MdFace4 } from "react-icons/md";
import { useState, useEffect } from "react";
import SearchModal from "./SearchModal";
import Link from "next/link";
import CartDrawer from "./CartDrawer";
import FavoritesDrawer from "./FavoritesDrawer";
import { hamburgerMenuState } from "./store";
import { useAtom, useStore } from "jotai";
import { useRouter } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hamMenuOpen, setHamMenuOpen] = useAtom(hamburgerMenuState, {
    store: useStore(),
  });

  // Manage submenu visibility
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getAuthenticatedUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const handleOnClickHamburgerMenu = () => {
    setHamMenuOpen(true);
  };

  const toggleSubmenu = (name: any) => {
    if (activeSubmenu === name) {
      setActiveSubmenu(null); // Close submenu if it's already open
    } else {
      setActiveSubmenu(name); // Open the clicked submenu
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push("/profile");
    } else {
      router.push("/auth");
    }
  };

  const navItems = [
    { 
      name: "CRAZY DEALS", 
      icon: <RiDiscountPercentFill size={24} />,
      link: "/#crazy-deals"
    },
    { 
      name: "SHOP ALL", 
      icon: <LuStore size={24} />,
      link: "/shop"
    },
    { 
      name: "BESTSELLERS", 
      icon: <GrLike size={24} />,
      link: "/#best-sellers"
    },
    {
      name: "ABOUT US",
      icon: <GiPerfumeBottle size={24} />,
      link: "/about-us"
    },
    {
      name: "RECIPES",
      icon: <FaBath size={24} />,
      link: "/recipes"
    },
    { 
      name: "BLOG", 
      icon: <PiHighlighterCircleBold size={24} />,
      link: "/blog"
    },
    {
      name: "CONTACT US",
      icon: <MdFace4 size={24} />,
      link: "/contact-us"
    },
  ];

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left side: Empty for mobile centering */}
          <div className="flex items-center lg:hidden">
            <div className="w-16"></div>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center flex-1 lg:flex-none">
            <Link href={"/"} className="group">
              <div className="relative">
                <img
                  src="/images/logo.png"
                  alt="NE CRAFTERS Logo"
                  className="h-20 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Center: Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for spicy goodness..."
                onClick={() => setOpen(true)}
                className="w-full pl-5 pr-5 py-3 rounded-full border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-sans text-gray-700 placeholder-gray-400 focus:outline-none bg-gray-50 focus:bg-white shadow-sm hover:shadow-md"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {open && <SearchModal setOpen={setOpen} />}
            </div>
          </div>

          {/* Right side: User actions */}
          <div className="flex items-center space-x-1">
            {/* Profile Button - Hidden on mobile */}
            <Button
              onClick={handleProfileClick}
              variant={"ghost"}
              size={"icon"}
              className="hidden lg:flex hover:bg-primary/10 text-primary"
            >
              <User size={24} />
            </Button>
            <div className="relative">
              <FavoritesDrawer />
            </div>
            <div className="relative">
              <CartDrawer />
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <div className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="mx-6 text-base font-semibold text-gray-600 hover:text-primary transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
