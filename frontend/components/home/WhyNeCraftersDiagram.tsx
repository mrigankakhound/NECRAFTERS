"use client";

import React from 'react';
import Image from 'next/image';

const WhyNeCraftersDiagram = () => {

  // Show the large whyNEcraft.png image
  return (
    <div id="why-ne-crafters" className="container mx-auto px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          <img
            src="/images/aboutUs/whyNEcraft.png"
            alt="Why NE Crafters - Our Values and Mission"
            className="w-full max-w-6xl h-auto rounded-lg"
            style={{
              imageRendering: 'crisp-edges'
            }}
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'w-full h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center text-gray-500';
              fallback.innerHTML = '<div class="text-center"><div class="text-4xl mb-2">🖼️</div><p>Image not available</p></div>';
              target.parentNode?.appendChild(fallback);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WhyNeCraftersDiagram;
