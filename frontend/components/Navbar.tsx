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
      link: "/#special-combos"
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
    <nav className="w-full bg-background relative">
      <div className="absolute inset-0 bg-chili-pattern opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center lg:w-1/3">
            <Sheet open={hamMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="lg:hidden mr-2 hover:bg-primary/10"
                  onClick={() => handleOnClickHamburgerMenu()}
                >
                  <Menu size={24} className="text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={"left"}
                className="w-[300px] sm:w-[400px] overflow-y-auto bg-background"
              >
                <div className="flex items-center space-x-4 mb-2">
                  <User
                    size={40}
                    className="border-2 border-primary p-1 rounded-full text-primary"
                  />
                  <div className="">
                    <p className="text-sm font-display font-medium text-primary">Download our app</p>
                    <p className="text-sm text-muted-foreground font-sans">
                      and get 10% OFF!
                    </p>
                  </div>
                </div>
                <Button className="w-full mb-2 spicy-button font-display">
                  Download App
                </Button>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    value={"outline"}
                    className="flex items-center justify-center space-x-2 bg-secondary/10 hover:bg-secondary/20 text-secondary font-display transition-colors"
                  >
                    <Package size={20} />
                    <span>MY ORDERS</span>
                  </Button>
                  <Button
                    value={"outline"}
                    className="flex items-center justify-center space-x-2 bg-secondary/10 hover:bg-secondary/20 text-secondary font-display transition-colors"
                  >
                    <Truck size={20} />
                    <span>TRACK ORDER</span>
                  </Button>
                </div>
                {/* Menu items with submenus */}
                <div className="space-y-4">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.link}
                        className="flex items-center justify-between py-3 border-b border-border/20 text-foreground cursor-pointer hover:bg-primary/5 transition-colors px-2"
                      >
                        <div className="flex items-center space-x-4 text-primary">
                          {item.icon}
                          <span className="font-display font-medium">{item.name}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* For larger screens */}
            <div className="hidden lg:block w-full max-w-xs">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for spicy goodness..."
                  onClick={() => setOpen(true)}
                  className="pl-10 pr-4 py-2 w-full border-b-2 border-primary/20 focus:border-primary/50 transition-colors font-sans text-foreground/80 focus:outline-none"
                />
                {open && <SearchModal setOpen={setOpen} />}
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center lg:w-1/3">
            <Link href={"/"} className="group">
              <div className="relative">
                <img
                  src="/images/logo.png"
                  alt="NE CRAFTERS Logo"
                  className="h-12 group-hover:opacity-0 transition-opacity duration-300"
                />
                <img
                  src="/images/logo.png"
                  alt="NE CRAFTERS Logo"
                  className="h-12 absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-end lg:w-1/3 space-x-2">
            <Button
              onClick={handleProfileClick}
              variant={"ghost"}
              size={"icon"}
              className="lg:flex hover:bg-primary/10 text-primary"
            >
              <User size={24} />
            </Button>
            <FavoritesDrawer />
            <CartDrawer />
          </div>
        </div>

        {/* For larger screens */}
        <div className="hidden lg:block border-t border-border/20 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-evenly py-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="text-sm font-display font-medium text-foreground/70 hover:text-primary group transition duration-300"
                >
                  {item.name}
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"></span>
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
