// "use client" directive indicates this component is client-side only
"use client";

// Import necessary components and libraries
import ProductCard from "@/components/home/ProductCard";
import FilterButton from "@/components/shop/FilterButton";
import ShopPopup from "@/components/ShopPopup";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAllProducts,
  sortProducts,
  getFilteredProducts,
} from "@/actions/products/index";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// Define Product type based on your Prisma schema
type ProductSize = {
  size: string;
  qty: number;
  price: number;
  sold: number;
};

type Image = {
  url: string | null;
  public_id: string | null;
};

type ProductBenefit = {
  name: string;
};

type ProductIngredient = {
  name: string;
};

type Product = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  brand: string | null;
  slug: string;
  rating: number;
  numReviews: number;
  featured: boolean;
  sku: string;
  images: Image[];
  sizes: ProductSize[];
  discount: number | null;
  sold: number | null;
  categoryId: string;
  benefits: ProductBenefit[];
  ingredients: ProductIngredient[];
  category: {
    name: string;
    id: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    images: Image[];
  };
  productSubCategories?: {
    id: string;
    productId: string;
    subCategoryId: string;
    createdAt: Date;
    updatedAt: Date;
    subCategory: {
      id: string;
      name: string;
      slug: string;
      parentId: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
  createdAt: Date;
  updatedAt: Date;
};

// Loading skeleton component for products
const ProductsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array(12)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="space-y-4 animate-pulse">
          <Skeleton className="h-[300px] w-full bg-gray-200" />
          <Skeleton className="h-4 w-3/4 bg-gray-200" />
          <Skeleton className="h-4 w-1/2 bg-gray-200" />
          <Skeleton className="h-4 w-1/4 bg-gray-200" />
        </div>
      ))}
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="text-center py-12">
    <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
    <p className="text-gray-600 mb-6">
      We couldn't find any products matching your filters.
    </p>
    <button
      onClick={() => (window.location.href = "/shop")}
      className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
    >
      Clear All Filters
    </button>
  </div>
);

// ShopPage component displays the product listing page with sorting and filtering functionality
const ShopPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // State to manage the sorting options for the products
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "Featured"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    // Check if popup should be shown (session-based logic)
    const shouldShowPopup = () => {
      try {
        // Check if popup was dismissed in this session
        const popupDismissed = sessionStorage.getItem('shopPopupDismissed');
        return !popupDismissed;
      } catch (error) {
        // Fallback if sessionStorage is not available
        return false;
      }
    };

    // Show popup if it hasn't been dismissed in this session
    if (shouldShowPopup()) {
      // Reduced delay for faster popup display
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchParams, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Get all filter parameters from URL
        const categories = searchParams
          .get("categories")
          ?.split(",")
          .filter(Boolean);
        const subCategories = searchParams
          .get("subCategories")
          ?.split(",")
          .filter(Boolean);
        const sizes = searchParams.get("sizes")?.split(",").filter(Boolean);
        const minPrice = Number(searchParams.get("minPrice")) || undefined;
        const maxPrice = Number(searchParams.get("maxPrice")) || undefined;

        // Check if any filters are applied
        const hasFilters =
          categories?.length ||
          subCategories?.length ||
          sizes?.length ||
          minPrice ||
          maxPrice;

        let result;
        if (hasFilters) {
          // If filters are applied, use getFilteredProducts
          result = await getFilteredProducts({
            categories,
            subCategories,
            sizes,
            minPrice,
            maxPrice,
            sortBy,
          });
          setPagination({
            total: result?.data?.length || 0,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          });
        } else if (sortBy === "Featured") {
          result = await getAllProducts(currentPage, 12); // Reduced from 20 to 12 for faster loading
          setPagination(result?.pagination || {
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          });
        } else {
          result = await sortProducts(sortBy, currentPage, 12); // Reduced from 20 to 12 for faster loading
          setPagination(result?.pagination || {
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          });
        }

        setProducts(result?.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Add debouncing to prevent excessive API calls
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchParams, sortBy, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (value: string) => {
    if (value === sortBy) return; // Prevent unnecessary re-renders
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sorting changes
    const params = new URLSearchParams(window.location.search);
    params.set("sortBy", value);
    router.push(`?${params.toString()}`);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    // Mark popup as dismissed in session storage
    try {
      sessionStorage.setItem('shopPopupDismissed', 'true');
    } catch (error) {
      // Fallback if sessionStorage is not available
      console.warn('Could not save popup state to session storage');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Popup */}
      <ShopPopup isOpen={showPopup} onClose={handlePopupClose} />
      
      {/* Page title */}
      <h1 className="text-lg font-bold sm:text-3xl text-center w-full py-4 sm:py-6 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">Shop All Products</h1>

      {/* Container for the filter button and sorting dropdown */}
      <div className="flex justify-center items-center mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Filter button component to open product filtering options */}
          {/* <FilterButton isLoading={isLoading} /> */}

          {/* Sorting dropdown to allow users to sort products by criteria like price or rating */}
          <div className="relative group animate-bounce">
            {/* Animated background glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out -z-10 animate-pulse"></div>
            
            {/* Animated border gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out -z-5"></div>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="relative z-10 appearance-none bg-white text-gray-800 px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50 cursor-pointer min-w-[200px] text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu"
              disabled={isLoading}
            >
              {isLoading && (
                <option disabled className="py-2 px-3 bg-white text-gray-400">
                  Loading...
                </option>
              )}
              <option className="py-2 px-3 bg-white text-gray-800">Featured</option>
              <option className="py-2 px-3 bg-white text-gray-800">Price: Low to High</option>
              <option className="py-2 px-3 bg-white text-gray-800">Price: High to Low</option>
              <option className="py-2 px-3 bg-white text-gray-800">Newest</option>
              <option className="py-2 px-3 bg-white text-gray-800">Best Sellers</option>
            </select>

            {/* Animated chevron icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-500 z-20">
              <ChevronDown className="h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-180 group-hover:text-purple-500" />
            </div>

            {/* Floating particles effect */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>

      {/* Display loading, empty state, or products */}
      {isLoading ? (
        <ProductsSkeleton />
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ProductCard heading="" products={products} shop={true} />
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev || isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext || isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          )}
          
          {/* Results Count */}
          <div className="text-center text-gray-600 mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span>Loading products...</span>
              </div>
            ) : (
              `Showing ${products.length} of ${pagination.total} products`
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShopPage;
