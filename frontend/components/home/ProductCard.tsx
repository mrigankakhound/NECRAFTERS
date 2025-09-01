"use client";

import { Star, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";
import { useCart } from "@/store/useCart";
import { toast } from "sonner";
import { useEffect, useState, memo } from "react";

interface ProductCardProps {
  heading: string;
  products: Product[];
  shop?: boolean;
  sectionId?: string;
  refreshInterval?: number;
  isCached?: boolean; // New prop to show caching status
}

// Memoize the component to prevent unnecessary re-renders
const ProductCard = memo(({ 
  heading, 
  products: initialProducts, 
  shop, 
  sectionId, 
  refreshInterval = 30000,
  isCached = false 
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time product updates only for specific sections
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      
      let endpoint = '';
      if (heading === "NEW ARRIVALS") {
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
    if (heading === "NEW ARRIVALS") {
      // Only fetch fresh data on mount for new arrivals
      fetchProducts();
    }
    // Removed BEST SELLERS from auto-refresh to prevent double fetching
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
    <div id={sectionId} className="w-full sm:container sm:mx-auto mb-[20px]">
      <div className="section-container">
        {/* Cache indicator for debugging */}
        {isCached && (
          <div className="text-xs text-gray-500 text-center mb-2">
            📦 Using cached data (fallback mode)
          </div>
        )}
      </div>

      <div className="relative">
        <div
          className={`${
            shop
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4"
              : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4"
          }`}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
            >
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].url || ""}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={false} // Don't prioritize all images
                      loading="lazy" // Lazy load for better performance
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                  
                  {/* Discount badge */}
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  )}
                  
                  {/* Rating badge */}
                  {product.rating && product.rating > 0 && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      {product.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                <div className="p-2 sm:p-3">
                  <h3 className="font-semibold text-xs sm:text-sm tracking-wide line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  {/* Price display */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        {product.discount && product.discount > 0 ? (
                          <>
                            <span className="text-xs text-gray-500 line-through">
                              ₹{product.sizes[0].price.toFixed(2)}
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              ₹{(product.sizes[0].price * (1 - product.discount / 100)).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold">
                            ₹{product.sizes[0].price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              {/* Add to Cart Button */}
              <div className="p-2 sm:p-3 pt-0">
                <Button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full bg-black text-white hover:bg-gray-800 text-xs sm:text-sm py-2 h-auto"
                  size="sm"
                >
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;