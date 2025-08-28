"use client";
import React, { useState } from "react";

const NeedOfWebsite = () => {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const features = [
    {
      image: "/images/icons/No Msg.png",
      title: "100% NATURAL INGREDIENTS",
      description:
        "Nothing artificial, only nature’s finest crafted for your plate.",
    },
    {
      image: "/images/icons/quality-free.png",
      title: "QUALITY & ADULTERATION FREE",
      description:
        "Nothing added, nothing fake, just honest flavors from the earth.",
    },
    {
      image: "/images/icons/Reducing carbon Footprint.png",
      title: "REDUCING CARBON FOOTPRINTS",
      description: 
        "Converting agricultural waste into biochar, creating a sustainable carbon sink.",
    },
    {
      image: "/images/icons/Supportijng farmers.png",
      title: "SUPPORTING FARMERS",
      description:
        "Direct sourcing from local farmers ensuring fair prices and sustainable livelihoods.",
    },
    {
      image: "/images/icons/No preservatives.png",
      title: "SMALL BATCHES, FRESHLY MADE",
      description: 
        "Made with love, limited quantity, always retaining authentic natural flavour",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-lg font-bold sm:text-3xl text-center w-full py-4 sm:py-6 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">WHY NE CRAFTERS?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4 sm:p-6">
            <div className={`relative mb-4 sm:mb-6 ${
              index === 4 
                ? "w-20 h-20 sm:w-24 sm:h-24" 
                : "w-16 h-16 sm:w-20 sm:h-20"
            }`}>
              {failedImages.has(index) ? (
                // Fallback icon when image fails to load
                <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 ${
                  index === 4 ? "text-2xl" : "text-xl"
                } text-gray-500`}>
                  {feature.title.charAt(0)}
                </div>
              ) : (
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={(e) => {
            
                    setFailedImages(prev => new Set(prev).add(index));
                  }}
                  onLoad={() => {
            
                  }}
                />
              )}
            </div>
            <h3 className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 font-semibold text-[#33475b] leading-tight">
              {feature.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5f6b7b] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeedOfWebsite;