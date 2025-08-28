"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const WhyNeCraftersDiagram = () => {
  const [imageError, setImageError] = useState(false);

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

  if (imageError) {
    return (
      <div id="why-ne-crafters" className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-12 font-sans">
            WHY NE CRAFTERS?
          </h2>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
               {features.map((feature, index) => (
                 <div key={index} className="text-center">
                   <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                     <Image
                       src={feature.icon}
                       alt={feature.title}
                       width={80}
                       height={80}
                       className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                       onError={(e) => {
                         // Fallback to a simple icon if the image fails
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                         const fallback = document.createElement('div');
                         fallback.className = 'w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center';
                         fallback.innerHTML = `<span class="text-2xl font-bold text-gray-400">${feature.title.charAt(0)}</span>`;
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
  }

  return (
    <div id="why-ne-crafters" className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto relative">
        <Image
          src="/images/aboutUs/whyNEcraft.png"
          alt="Why NE Crafters Process"
          width={1200}
          height={800}
          className="w-full h-auto"
          priority
          onError={() => setImageError(true)}
          onLoad={() => console.log('Image loaded successfully')}
        />
      </div>
    </div>
  );
};

export default WhyNeCraftersDiagram;
