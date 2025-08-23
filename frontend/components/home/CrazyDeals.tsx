import { HomeScreenOffer } from "@prisma/client";
import Link from "next/link";

interface CrazyDealsProps {
  offers: HomeScreenOffer[];
}

const CrazyDeals = ({ offers }: CrazyDealsProps) => {
  return (
    <div id="crazy-deals" className="container mx-auto mb-[20px] px-4">
      {/* Debug info */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>Debug: Received {offers.length} offers</p>
        <pre className="text-xs">{JSON.stringify(offers, null, 2)}</pre>
      </div>
      
      <div className="section-container">
        <h2 className="text-lg font-bold sm:text-3xl text-center w-full relative py-4 sm:py-6 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
          GIFT HAMPER
        </h2>
      </div>
      <div className="relative flex justify-center">
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
      </div>
    </div>
  );
};

export default CrazyDeals;
