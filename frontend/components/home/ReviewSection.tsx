"use client";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useCallback } from "react";
import { CiInstagram } from "react-icons/ci";

const reviews = [
  {
    id: 1,
    name: "Sikhashree Gogoi",
    instagram: "sikhaa._",
    image: "/images/aboutUs/sikha.jpg",
    rating: 5,
    text: "Bamboo Shoot with Bhut Jolokia is a game-changer! It adds incredible heat and depth to every dish. Perfect for spice lovers seeking an authentic, fiery kick. Highly recommended!",
  },
  {
    id: 2,
    name: "Rituparna Borah",
    instagram: "rituparna.borah_",
    image: "https://placehold.co/200x200",
    rating: 5,
    text: "Bhut Jolokia Chilli Oil is my top favorite so far. I love the aroma and its distinct taste. I am eagerly waiting to try the other products too. Cheers to NE CRAFTERS !!!",
  },
  {
    id: 3,
    name: "Mriganka Khound",
    instagram: "_mriganka_khound_",
    image: "/images/aboutUs/mriganka.jpg",
    rating: 5,
    text: "NE CRAFTERS chilli oil is seriously addictive — rich, aromatic, and with just the right amount of heat. You can taste the quality in every spoonful, and it makes pretty much any meal instantly better. Once you try it, you'll want to put it on everything.",
  },
];

const ReviewSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-rotation effect
  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="w-full bg-[#f2e6e9] py-16 mb-20 relative overflow-hidden">
      {/* Modern stylish background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Desktop background - gradient orbs, geometric shapes, etc. */}
        <div className="hidden sm:block">
          {/* Floating gradient orbs */}
          <div className="absolute top-8 left-8 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-40 h-40 bg-gradient-to-br from-red-400/15 to-orange-500/15 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-4 w-24 h-24 bg-gradient-to-br from-orange-300/25 to-yellow-400/25 rounded-full blur-lg animate-pulse delay-500"></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-16 right-16 w-16 h-16 border border-orange-300/30 rotate-45 transform-gpu"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 border border-red-300/40 rounded-full"></div>
          <div className="absolute top-1/3 right-8 w-8 h-8 bg-gradient-to-br from-orange-400/40 to-red-400/40 rounded-lg rotate-12 transform-gpu"></div>
          
          {/* Floating accent lines */}
          <div className="absolute top-24 left-1/4 w-20 h-0.5 bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>
          <div className="absolute bottom-28 right-1/4 w-16 h-0.5 bg-gradient-to-r from-transparent via-red-400/50 to-transparent"></div>
          
          {/* Modern icon accents - subtle and stylish */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce"></div>
          </div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-bounce delay-300"></div>
          </div>
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-orange-300/40"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-red-300/40"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-orange-300/40"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-red-300/40"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(251,146,60,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.1)_0%,transparent_50%)]"></div>
        </div>
        
        {/* Mobile background - PNG icons only */}
        <div className="sm:hidden">
          {/* Stylish PNG icons integration for mobile */}
          <div className="absolute top-4 left-6 w-12 h-12 opacity-30 hover:opacity-50 transition-opacity duration-300 transform hover:scale-110">
            <img src="/images/reviewicons/bowl.png" alt="" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="absolute top-8 right-8 w-10 h-10 opacity-25 hover:opacity-45 transition-opacity duration-300 transform hover:scale-110">
            <img src="/images/reviewicons/chilli.png" alt="" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="absolute bottom-6 left-8 w-8 h-8 opacity-30 hover:opacity-50 transition-opacity duration-300 transform hover:scale-110">
            <img src="/images/reviewicons/tacos.png" alt="" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="absolute bottom-8 right-6 w-10 h-10 opacity-25 hover:opacity-45 transition-opacity duration-300 transform hover:scale-110">
            <img src="/images/reviewicons/brown ful.png" alt="" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="absolute top-1/2 left-2 w-6 h-6 opacity-20 hover:opacity-40 transition-opacity duration-300 transform hover:scale-110">
            <img src="/images/reviewicons/clove.png" alt="" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="absolute top-1/3 right-4 w-8 h-8 opacity-25 hover:opacity-45 transition-opacity duration-300 transform hover:scale-110">
            <img src="/images/reviewicons/bowl.png" alt="" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="absolute bottom-1/3 left-4 w-6 h-6 opacity-30 hover:opacity-50 transition-opacity duration-300 transform hover:scale-110">
            <img src="/images/reviewicons/chilli.png" alt="" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="absolute top-2/3 right-2 w-8 h-8 opacity-20 hover:opacity-40 transition-opacity duration-300 transform hover:scale-110">
            <img src="/images/reviewicons/tacos.png" alt="" className="w-full h-full object-contain drop-shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-16">
          <div className="text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
              WHAT OUR CUSTOMERS HAVE TO SAY
            </h2>
            {/* Modern decorative element */}
            <div className="flex justify-center items-center space-x-3">
              <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
              <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-orange-400 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((review) => (
                <div key={review.id} className="flex-[0_0_100%] min-w-0 px-4 sm:px-6">
                  <div className="relative">
                    {/* Main review card */}
                    <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg border border-gray-100 relative overflow-hidden">
                      {/* Background accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -translate-y-16 translate-x-16 opacity-60"></div>
                      
                      <div className="relative z-10">
                        {/* Header section with profile and rating */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                          {/* Profile section */}
                          <div className="relative">
                            <div className="relative">
                              <img
                                src={review.image}
                                alt={`${review.name}'s profile`}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-lg ring-4 ring-white"
                              />
                              {/* Floating badge */}
                              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-sm font-bold">5</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Rating and name section */}
                          <div className="text-center sm:text-left flex-1">
                            <div className="flex justify-center sm:justify-start mb-3">
                              {[...Array(5)].map((_, index: number) => (
                                <Star
                                  key={index}
                                  className={`w-6 h-6 sm:w-7 sm:h-7 ${
                                    index < review.rating
                                      ? "text-yellow-400 fill-current drop-shadow-sm"
                                      : "text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                              {review.name}
                            </h3>
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-full border border-orange-200">
                              <CiInstagram size={18} className="text-[#b8004d]" />
                              <span className="text-sm font-medium text-gray-700">{review.instagram}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Review text */}
                        <div className="relative">
                          <div className="text-6xl text-orange-200 absolute -top-8 left-0 font-serif">"</div>
                          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed pl-8 pr-4 font-medium italic">
                            {review.text}
                          </p>
                          <div className="text-6xl text-red-200 absolute -bottom-8 right-0 font-serif">"</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom accent card */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 -mt-6 mx-8 relative z-20 shadow-lg">
                      <div className="flex items-center justify-center space-x-4 text-white">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Verified Customer Review</span>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Enhanced navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full p-4 transition-all duration-300 shadow-lg hover:shadow-xl z-20 group"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-full p-4 transition-all duration-300 shadow-lg hover:shadow-xl z-20 group"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;