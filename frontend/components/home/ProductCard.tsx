"use client";

import { Star, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";
import { useCart } from "@/store/useCart";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ProductCardProps {
  heading: string;
  products: Product[];
  shop?: boolean;
  sectionId?: string;
  refreshInterval?: number; // Add refresh interval prop
}

const ProductCard = ({ heading, products: initialProducts, shop, sectionId, refreshInterval = 30000 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time product updates
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      let endpoint = '';
      if (heading === "BEST SELLERS") {
        endpoint = '/api/products/best-sellers?limit=8';
      } else if (heading === "NEW ARRIVALS") {
        endpoint = '/api/products/new-arrivals?limit=4';
      } else {
        // For other sections, don't refresh
        return;
      }
      
      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setProducts(data.data);
        }
      }
    } catch (error) {
      // Silent error - don't show error toast for background refresh
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on mount only (no auto-refresh)
  useEffect(() => {
    if (heading === "BEST SELLERS" || heading === "NEW ARRIVALS") {
      // Only fetch fresh data on mount, no auto-refresh
      fetchProducts();
    }
  }, [heading]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Stop event bubbling
    
    // Get the first available size
    const firstSize = product.sizes?.[0];
    if (!firstSize) {
      toast.error("No size available");
      return;
    }
    
    const discountedPrice = firstSize.price * (1 - (product.discount || 0) / 100);
    
    // Add to cart
    addToCart({
      productId: product.id,
      name: product.title,
      image: product.images?.[0]?.url || "",
      size: firstSize.size,
      quantity: 1,
      price: discountedPrice,
      maxQuantity: firstSize.qty || 10,
    });
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div id={sectionId} className="w-full px-4 sm:container sm:mx-auto mb-[20px]">
      <div className="section-container">
        {/* Removed refresh button - no longer needed */}
      </div>

      <div className="relative">
        <div
          className={`${
            shop
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4"
          } mb-8`}
        >
          {products.map((product) => {
            const mainImage = product.images?.[0]?.url;
            const secondImageCandidate = product.images?.[1]?.url;
            const originalPrice = product.sizes?.[0]?.price || 0;
            const discount = product.discount || 0;
            const discountedPrice = originalPrice * (1 - discount / 100);

            return (
              <Link
                href={`/product/${product.slug ?? product.id}`}
                key={product.id}
                className="group bg-white rounded-lg p-4 sm:p-3"
                prefetch={false}
              >
                <div className="relative aspect-square mb-4 sm:mb-3 overflow-hidden rounded-md">
                  {mainImage ? (
                    <>
                      <Image
                        src={mainImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to placeholder if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center';
                          fallback.innerHTML = '<div class="text-4xl">🛍️</div>';
                          target.parentNode?.appendChild(fallback);
                        }}
                      />
                      {secondImageCandidate && secondImageCandidate !== mainImage && (
                        <Image
                          src={secondImageCandidate}
                          alt={`${product.title} - Hover`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="absolute inset-0 object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                        />
                      )}
                    </>
                  ) : (
                    // Fallback when no image
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                      <div className="text-4xl">🛍️</div>
                    </div>
                  )}
                  
                  {/* Add to Cart Button - appears on hover */}
                  <div className="absolute inset-0 flex items-end justify-center p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full bg-black/80 hover:bg-black text-white backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-base sm:text-base line-clamp-2">
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
                    <p className="text-lg sm:text-lg font-semibold">
                      ₹{discountedPrice > 0 ? discountedPrice.toFixed(2) : '0.00'}
                    </p>
                    {discount > 0 && originalPrice > 0 && (
                      <>
                        <p className="text-sm sm:text-base text-gray-500 line-through">
                          ₹{originalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm sm:text-base text-red-500">-{discount}%</p>
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