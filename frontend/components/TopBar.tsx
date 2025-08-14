"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarButton {
  text?: string | null;
  link?: string | null;
  textColor: string;
  backgroundColor: string;
}

interface TopBar {
  id: string;
  title: string;
  link: string;
  textColor: string;
  backgroundColor?: string | null;
  button?: TopBarButton | null;
}

export default function TopBar() {
  const [topBars, setTopBars] = useState<TopBar[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTopBars() {
      try {
        const response = await fetch("/api/topbar");
        const data = await response.json();
        if (data.success) {
          setTopBars(data.data);
        }
        console.log(data);
      } catch (error) {
        console.error("Error fetching top bars:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopBars();
  }, []);

  useEffect(() => {
    if (topBars.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === topBars.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [topBars.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === topBars.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? topBars.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) {
    return (
      <div className="h-12 bg-gray-100 animate-pulse">
        <div className="max-w-7xl mx-auto h-full"></div>
      </div>
    );
  }

  if (topBars.length === 0) {
    return null;
  }

  const currentTopBar = topBars[currentIndex];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundColor: currentTopBar.backgroundColor || "#000000",
      }}
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center h-7 relative">
          {/* Fixed button on the right with gradient overlay */}
          {currentTopBar.button && (
            <>
              <div 
                className="absolute right-0 w-32 h-full z-[5]"
                style={{
                  background: `linear-gradient(to right, transparent, ${currentTopBar.backgroundColor || "#000000"})`
                }}
              />
              <div className="absolute right-4 z-10">
                <Link
                  href={currentTopBar.button.link || "#"}
                  className={cn(
                    "px-4 py-1 rounded-full text-sm font-medium",
                    "transition-all duration-300 hover:opacity-90 hover:scale-105"
                  )}
                  style={{
                    backgroundColor: currentTopBar.button.backgroundColor,
                    color: currentTopBar.button.textColor,
                  }}
                >
                  {currentTopBar.button.text}
                </Link>
              </div>
            </>
          )}

          {/* Scrolling text container */}
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-flex items-center animate-marquee">
              <Link
                href={currentTopBar.link}
                className="text-center"
                style={{ color: currentTopBar.textColor }}
              >
                <span className="text-sm font-medium inline-flex items-center gap-8">
                  {/* Repeat the text multiple times for continuous scroll */}
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="inline-flex items-center gap-2">
                      {currentTopBar.title}
                      <span className="inline-block mx-4">•</span>
                    </span>
                  ))}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {topBars.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300 hover:scale-110 group"
              style={{ color: currentTopBar.textColor }}
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>

            {/* Next button */}
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300 hover:scale-110 group"
              style={{ color: currentTopBar.textColor }}
            >
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
              {topBars.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-current opacity-100 scale-125"
                      : "bg-current opacity-40 hover:opacity-60"
                  )}
                  style={{ color: currentTopBar.textColor }}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
