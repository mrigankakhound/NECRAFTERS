// "use client" directive indicates this component is client-side only
"use client";

// Import necessary components and libraries
import ProductCard from "@/components/home/ProductCard";

import ShopPopup from "@/components/ShopPopup";

import { useEffect, useState } from "react";
// Fetches now go through /api/products to avoid importing server-only code in the client

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
  bestSeller: boolean;
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

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          console.log("Categories fetched:", data);
          setCategories(data);
        } else {
          console.error("Failed to fetch categories:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Debug: Log categories state changes
  useEffect(() => {
    console.log("Categories state changed:", categories);
  }, [categories]);

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
    
    // Update selectedCategory from URL params
    const categoryParam = searchParams.get("category");
    setSelectedCategory(categoryParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", "12");

        // Single category slug
        if (selectedCategory) {
          params.set("category", selectedCategory);
        }

        // Multi filters from URL
        const categories = searchParams.get("categories");
        const subCategories = searchParams.get("subCategories");
        const sizes = searchParams.get("sizes");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const sortBy = searchParams.get("sortBy");

        if (categories) params.set("categories", categories);
        if (subCategories) params.set("subCategories", subCategories);
        if (sizes) params.set("sizes", sizes);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (sortBy) params.set("sortBy", sortBy);

        const res = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
        });
        const json = await res.json();

        if (json.success) {
          setProducts(json.data || []);
          setPagination(json.pagination || {
            total: json.data?.length || 0,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          });
        } else {
          console.error("Products API error:", json.error);
          setProducts([]);
          setPagination({ total: 0, totalPages: 0, hasNext: false, hasPrev: false });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setPagination({ total: 0, totalPages: 0, hasNext: false, hasPrev: false });
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProducts, 200);
    return () => clearTimeout(timeoutId);
  }, [searchParams, currentPage, selectedCategory]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleCategorySelect = (categorySlug: string) => {
    if (categorySlug === "" || selectedCategory === categorySlug) {
      // If "All Products" is clicked or same category is clicked, deselect it
      setSelectedCategory(null);
      setCurrentPage(1);
      const params = new URLSearchParams(window.location.search);
      params.delete("category");
      router.push(`?${params.toString()}`);
    } else {
      // Select new category
      setSelectedCategory(categorySlug);
      setCurrentPage(1);
      const params = new URLSearchParams(window.location.search);
      params.set("category", categorySlug);
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Popup */}
      <ShopPopup isOpen={showPopup} onClose={handlePopupClose} />
      
      {/* Page title */}
      <h1 className="text-lg font-bold sm:text-3xl text-center w-full py-4 sm:py-6 uppercase font-capriola bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
        {selectedCategory && categories.length > 0
          ? categories.find(cat => cat.slug === selectedCategory)?.name || 'Shop Products'
          : 'Shop All Products'
        }
      </h1>

      {/* Category Selection */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => handleCategorySelect("")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              !selectedCategory
                ? "bg-orange-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.slug)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category.slug
                  ? "bg-orange-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}



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
