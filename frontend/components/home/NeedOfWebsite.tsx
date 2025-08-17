import React from "react";

const NeedOfWebsite = () => {
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
        "(Made with love, limited quantity, always retaining authentic natural flavour",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="heading text-center mb-12 font-capriola">WHY NE CRAFTERS?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4 sm:p-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6">
              <img 
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-contain"
                loading="lazy"
              />
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