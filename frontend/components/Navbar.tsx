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
import { useRouter } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
    setIsMobileNavOpen(true);
  };

  const handleNavigation = (link: string) => {
    if (link.startsWith('/#')) {
      // Hash link - check if we're on homepage
      if (window.location.pathname === '/') {
        // Already on homepage, scroll to section
        const sectionId = link.substring(2);
        console.log('Scrolling to section:', sectionId);
        
        // Wait a bit for any dynamic content to load
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            console.log('Element found, scrolling...');
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            console.log('Element not found, trying alternative selectors...');
            // Try alternative selectors
            const alternativeElement = document.querySelector(`[data-section="${sectionId}"]`) || 
                                    document.querySelector(`[id*="${sectionId}"]`);
            if (alternativeElement) {
              console.log('Alternative element found, scrolling...');
              alternativeElement.scrollIntoView({ behavior: 'smooth' });
            } else {
              console.log('No element found for section:', sectionId);
            }
          }
        }, 100);
      } else {
        // Not on homepage, navigate to homepage with hash
        console.log('Navigating to homepage with hash:', link);
        router.push(link);
      }
    } else {
      // Regular link, navigate normally
      router.push(link);
    }
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
      name: "SHOP ALL", 
      icon: <LuStore size={24} />,
      link: "/shop"
    },
    { 
      name: "BEST SELLERS", 
      icon: <GrLike size={24} />,
      link: "/#best-sellers"
    },
    { 
      name: "GIFT HAMPER", 
      icon: <RiDiscountPercentFill size={24} />,
      link: "/#crazy-deals"
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
  ];

  return (
    <nav className="w-full bg-[#f9f7f6] shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Hamburger menu for mobile */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={handleOnClickHamburgerMenu}
              className="p-2 rounded-md text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors duration-200"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center flex-1 lg:flex-none">
            <Link href={"/"} className="group">
              <div className="relative lg:translate-x-0 translate-x-7">
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



        {/* Horizontal Icon Navigation - Desktop */}
        <div className="hidden lg:block bg-[#f9f7f6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-16 py-3">
              {/* Shop All */}
              <Link href="/shop" className="flex flex-col items-center space-y-2 group">
                <div className="w-16 h-16 p-3 transition-all duration-300">
                  <img 
                    src="/images/navicons/shop_all.png" 
                    alt="Shop All" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-base font-bold uppercase tracking-wide bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-700 group-hover:via-red-700 group-hover:to-orange-700 transition-all duration-300">
                  Shop All
                </span>
              </Link>

              {/* Best Sellers */}
              <Link href="/#best-sellers" className="flex flex-col items-center space-y-2 group">
                <div className="w-16 h-16 p-3 transition-all duration-300">
                  <img 
                    src="/images/navicons/best_seller.png" 
                    alt="Best Sellers" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-base font-bold uppercase tracking-wide bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-700 group-hover:via-red-700 group-hover:to-orange-700 transition-all duration-300">
                  Best Sellers
                </span>
              </Link>

              {/* Recipes */}
              <Link href="/recipes" className="flex flex-col items-center space-y-2 group">
                <div className="w-16 h-16 p-3 transition-all duration-300">
                  <img 
                    src="/images/navicons/recipes.png" 
                    alt="Recipes" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-base font-bold uppercase tracking-wide bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-700 group-hover:via-red-700 group-hover:to-orange-700 transition-all duration-300">
                  Recipes
                </span>
              </Link>

              {/* Special Combos */}
              <Link href="/#crazy-deals" className="flex flex-col items-center space-y-2 group">
                <div className="w-16 h-16 p-3 transition-all duration-300">
                  <img 
                    src="/images/navicons/gift_hamper.png" 
                    alt="Special Combos" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-base font-bold uppercase tracking-wide bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-700 group-hover:via-red-700 group-hover:to-orange-700 transition-all duration-300">
                  Gift Hamper
                </span>
              </Link>

              {/* Blog */}
              <Link href="/blog" className="flex flex-col items-center space-y-2 group">
                <div className="w-16 h-16 p-3 transition-all duration-300">
                  <img 
                    src="/images/navicons/blog.png" 
                    alt="Blog" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-base font-bold uppercase tracking-wide bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-700 group-hover:via-red-700 group-hover:to-orange-700 transition-all duration-300">
                  Blog
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav 
          isOpen={isMobileNavOpen} 
          onClose={() => setIsMobileNavOpen(false)} 
        />
      </div>
    </nav>
  );
};

export default Navbar;
