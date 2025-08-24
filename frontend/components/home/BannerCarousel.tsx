"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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

const BannerCarousel = ({ banners, app_banners }: BannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

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
      const mobile = width <= 768; // More reasonable mobile breakpoint
      console.log(`Screen width: ${width}px, isMobile: ${mobile}`);
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

  const images = isMobile
    ? (app_banners.length > 0 ? app_banners.map((banner) => banner.url) : banners.map((banner) => banner.url))
    : banners.map((banner) => banner.url);

  // Add debugging
  console.log(`BannerCarousel: isMobile=${isMobile}, banners=${banners.length}, app_banners=${app_banners.length}, images=${images.length}`);
  console.log('  Final images array:', images);
  console.log('  Image URLs:');
  images.forEach((url, index) => {
    console.log(`    Image ${index + 1}: ${url}`);
  });

  return (
    <div
      className={`relative w-full ${
        isMobile ? "h-[400px]" : "h-[400px]"
      } overflow-hidden mb-[20px]`}
    >
      {images.map((src, index) => {
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
      })}
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
