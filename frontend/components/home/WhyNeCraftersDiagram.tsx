"use client";

import React from 'react';
import Image from 'next/image';

const WhyNeCraftersDiagram = () => {

  const features = [
    {
      icon: "/images/icons/No preservatives.png",
      title: "100% NATURAL INGREDIENTS",
      description: "Nothing artificial, only nature's finest crafted for your plate."
    },
    {
      icon: "/images/icons/quality-free.png",
      title: "QUALITY & ADULTERATION FREE",
      description: "Nothing added, nothing fake, just honest flavors from the earth."
    },
    {
      icon: "/images/icons/Reducing carbon Footprint.png",
      title: "REDUCING CARBON FOOTPRINTS",
      description: "Converting agricultural waste into biochar, creating a sustainable carbon sink."
    },
    {
      icon: "/images/icons/Supportijng farmers.png",
      title: "SUPPORTING FARMERS",
      description: "Direct sourcing from local farmers ensuring fair prices and sustainable livelihoods."
    },
    {
      icon: "/images/icons/No Msg.png",
      title: "SMALL BATCHES, FRESHLY MADE",
      description: "Made with love, limited quantity, always retaining authentic natural flavour"
    }
  ];

p  // Always show the features section instead of the large image
  return (
    <div id="why-ne-crafters" className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-12 font-sans">
          WHY NE CRAFTERS?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 rounded-full p-2 shadow-sm group-hover:shadow-md transition-all duration-300">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Better fallback with emoji icons
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center text-3xl';
                    
                    // Use relevant emojis for each feature
                    const emojis = ['🌿', '✨', '🌱', '👨‍🌾', '🍃'];
                    fallback.innerHTML = emojis[index] || '🌟';
                    
                    target.parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyNeCraftersDiagram;
