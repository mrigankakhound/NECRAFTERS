import React from 'react';
import Image from 'next/image';

const WhyNeCraftersDiagram = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto relative">
        <Image
          src="/images/aboutUs/whyNEcraft.png"
          alt="Why NE Crafters Process"
          width={1200}
          height={800}
          className="w-full h-auto"
          priority
        />
      </div>
    </div>
  );
};

export default WhyNeCraftersDiagram;
