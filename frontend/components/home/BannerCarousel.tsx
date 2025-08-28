"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../ui/loading-spinner";

interface BannerCarouselProps {
  banners: {
    public_id: string;
    url: string;
  }[];
  app_banners: {
    public_id: string;
    url: string;
  }[];
}

const BannerCarousel = ({ banners: initialBanners, app_banners: initialAppBanners }: BannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [banners, setBanners] = useState(initialBanners);
  const [app_banners, setAppBanners] = useState(initialAppBanners);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  // Real-time banner updates
  const fetchBanners = async () => {
    try {
      setIsLoading(true); // Show loading while fetching

      // Fetch fresh banner data
      const [websiteResponse, appResponse] = await Promise.all([
        fetch('/api/banners/website'),
        fetch('/api/banners/app')
      ]);

      if (websiteResponse.ok) {
        const websiteData = await websiteResponse.json();
        setBanners(websiteData.banners || []);
      }

      if (appResponse.ok) {
        const appData = await appResponse.json();
        setAppBanners(appData.banners || []);
      }
    } catch (error) {
      console.log('Banner refresh failed:', error);
    } finally {
      setIsLoading(false); // Hide loading after fetch
    }
  };

  // Fetch banners on mount only (no auto-refresh)
  useEffect(() => {
    // Fetch fresh data on mount to avoid showing old cached banners
    fetchBanners();
  }, []);

  // Debug logging
  console.log('🎨 BannerCarousel Component Debug:');
  console.log('  Props received:');
  console.log('    banners:', banners);
  console.log('    app_banners:', app_banners);
  console.log('    banners.length:', banners?.length);
  console.log('    app_banners.length:', app_banners?.length);
  console.log('    banners type:', typeof banners);
  console.log('    app_banners type:', typeof app_banners);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleBannerClick = () => {
    router.push("/shop");
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width <= 768; // Mobile breakpoint at 768px
      console.log(`📱 Screen width: ${width}px, isMobile: ${mobile}`);
      setIsMobile(mobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    const interval = setInterval(nextSlide, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mobile logic: prefer app_banners if available, otherwise fallback to website banners
  // Ensure we always have images to display
  let images: string[] = [];
  
  if (isMobile) {
    if (app_banners && app_banners.length > 0) {
      images = app_banners.map((banner) => banner.url);
      console.log(`📱 Using mobile banners: ${images.length} images`);
    } else {
      images = banners.map((banner) => banner.url);
      console.log(`📱 Mobile banners not available, using website banners: ${images.length} images`);
    }
  } else {
    images = banners.map((banner) => banner.url);
    console.log(`🖥️  Using website banners: ${images.length} images`);
  }

  // Enhanced debugging for mobile banner issues
  console.log(`🎨 BannerCarousel Debug:`);
  console.log(`  📱 isMobile: ${isMobile}`);
  console.log(`  🖥️  website banners: ${banners.length}`);
  console.log(`  📱 mobile banners: ${app_banners.length}`);
  console.log(`  🎯 final images: ${images.length}`);
  console.log(`  📱 mobile banner URLs:`, app_banners.map(b => b.url));
  console.log(`  🖥️  website banner URLs:`, banners.map(b => b.url));
  console.log(`  🎯 final image URLs:`, images);

  return (
    <div
      className={`relative w-full ${
        isMobile ? "h-[400px]" : "h-[400px]"
      } overflow-hidden mb-[20px]`}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
          <LoadingSpinner 
            size="lg" 
            text="Crafting Mode On" 
            className="text-orange-600"
          />
        </div>
      ) : images.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
          <div className="text-center text-orange-600">
            <p className="text-lg font-semibold">No Banners Available</p>
            <p className="text-sm">Please check banner configuration</p>
          </div>
        </div>
      ) : (
        images.map((src, index) => {
          console.log(`🎯 Rendering image ${index}: ${src}`);
          return (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={handleBannerClick}
                onLoad={() => console.log(`✅ Image ${index} loaded successfully: ${src}`)}
                onError={(e) => console.error(`❌ Image ${index} failed to load: ${src}`, e)}
              />
            </div>
          );
        })
      )}
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-black rounded-none bg-transparent border-transparent hover:bg-white/10"
      >
        <ChevronLeft size={24} />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black rounded-none bg-transparent border-transparent hover:bg-white/10"
      >
        <ChevronRight size={24} />
      </Button>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;