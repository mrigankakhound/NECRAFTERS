"use client";

import { HomeScreenOffer } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/loading-spinner";

interface SpecialCombosProps {
  offers: HomeScreenOffer[];
}

const SpecialCombos = ({ offers: initialOffers }: SpecialCombosProps) => {
  const [offers, setOffers] = useState(initialOffers);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time offers updates
  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/offers/special-combos');
      
      if (response.ok) {
        const data = await response.json();
        setOffers(data.offers || []);
      }
    } catch (error) {
      console.log('Special combos refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch offers on mount only (no auto-refresh)
  useEffect(() => {
    // Fetch fresh data on mount to avoid showing old cached offers
    fetchOffers();
  }, []);

  return (
    <div className="container mx-auto mb-[20px] px-4">
      <div className="section-container">
        <h2 className="text-lg font-bold sm:text-3xl text-center w-full relative py-4 sm:py-6 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
          SPECIAL COMBOS
        </h2>
      </div>
      <div className="relative flex justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner 
              size="lg" 
              text="Crafting Mode On" 
              className="text-orange-600"
            />
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth no-scrollbar sm:justify-center">
            {offers.map((offer) => (
              <Link
                href={offer.link}
                key={offer.id}
                className="flex-shrink-0 w-[80vw] sm:w-[347px]"
              >
                <div className="flex flex-col items-center">
                  <div className="w-full aspect-[4/3] overflow-hidden">
                    <img
                      src={offer.images[0]?.url || ""}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center uppercase textGap font-[500] mt-2">
                    {offer.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialCombos;
