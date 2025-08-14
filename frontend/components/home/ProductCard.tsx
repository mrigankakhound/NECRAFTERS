import { Star } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Product } from "@/lib/generated/prisma";

interface ProductCardProps {
  heading: string;
  products: Product[];
  shop?: boolean;
}

const ProductCard = ({ heading, products, shop }: ProductCardProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
      <div className="section-container">
        <h2 className="section-heading">
          {heading}
        </h2>
      </div>

      <div className="relative">
        <div
          className={`${
            shop
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
              : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          } mb-8`}
        >
          {products.map((product) => {
            const mainImage = product.images[0]?.url;
            const secondImage = product.images[1]?.url || mainImage; // Fallback to main image if no second image
            const discountedPrice = product.sizes[0]?.price
              ? product.sizes[0].price * (1 - (product.discount || 0) / 100)
              : 0;

            return (
              <Link
                href={`/product/${product.slug}`}
                key={product.id}
                className="group bg-white rounded-lg p-2 sm:p-3"
              >
                <div className="relative aspect-square mb-2 sm:mb-3 overflow-hidden rounded-md">
                  {mainImage && (
                    <>
                      <img
                        src={mainImage}
                        alt={product.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <img
                        src={secondImage}
                        alt={`${product.title} - Hover`}
                        className="absolute inset-0 object-cover w-full h-full opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                      />
                    </>
                  )}
                </div>

                <div>
                  <p className="font-semibold text-sm sm:text-base line-clamp-2">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-1 sm:gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({product.numReviews})
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                    <p className="text-base sm:text-lg font-semibold">
                      ₹{discountedPrice.toFixed(2)}
                    </p>
                    {product.discount && product.discount > 0 && (
                      <>
                        <p className="text-sm sm:text-base text-gray-500 line-through">
                          ₹{product.sizes[0]?.price.toFixed(2)}
                        </p>
                        <p className="text-sm sm:text-base text-red-500">-{product.discount}%</p>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {!shop && (
        <div className="flex justify-center mt-8">
          <Link href="/shop" className="w-full sm:w-auto">
            <Button
              variant={"outline"}
              className="w-full sm:w-[347px] border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary font-medium tracking-wider px-[10px] py-[20px] transition-colors"
            >
              VIEW ALL
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;