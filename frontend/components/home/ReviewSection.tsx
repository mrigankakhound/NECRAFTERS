"use client";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
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
  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="w-full bg-[#f2e6e9] py-16 mb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-center text-[#33475b] font-capriola">
            WHAT OUR CUSTOMERS HAVE TO SAY
          </h2>
        </div>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((review) => (
                <div key={review.id} className="flex-[0_0_100%] min-w-0 px-4 sm:px-6">
                  <div className="bg-[#f2e6e9] flex flex-col items-center">
                    <img
                      src={review.image}
                      alt={`${review.name}'s profile`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-6 sm:mb-8 object-cover ring-2 ring-[#00B8A9]/20"
                    />
                    <div className="flex mb-4 sm:mb-6">
                      {[...Array(5)].map((_, index: number) => (
                        <Star
                          key={index}
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            index < review.rating
                              ? "text-[#b8004d] fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-center mb-6 sm:mb-8 text-base sm:text-lg text-[#5f6b7b] leading-relaxed max-w-2xl">
                      {review.text}
                    </p>
                    <p className="font-display text-lg sm:text-xl mb-2 text-[#33475b]">
                      {review.name}
                    </p>
                    <p className="text-[#5f6b7b] flex items-center gap-2">
                      <CiInstagram size={18} className="text-[#b8004d]" />
                      {review.instagram}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-[#b800461a] hover:bg-[#b800461a] rounded-full p-3 transition-colors"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 text-[#b8004d]" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-[#b800461a] hover:bg-[#b800461a] rounded-full p-3 transition-colors"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 text-[#b8004d]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;