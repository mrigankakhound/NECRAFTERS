"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getAllProducts, updateProductFeatured, updateProductBestSeller, deleteProduct } from "@/app/actions/product.actions";
import { Plus, Search, Edit, Trash2, Star, TrendingUp, Package } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProductSize {
  size: string;
  price: number;
  quantity: number;
}

interface Product {
  id: string;
  title: string;
  mainImage: string;
  category: string;
  sizes: ProductSize[];
  featured: boolean;
  bestSeller: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Memoized filtered products for better performance
  const memoizedFilteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Update filtered products when memoized results change
  useEffect(() => {
    setFilteredProducts(memoizedFilteredProducts);
  }, [memoizedFilteredProducts]);

  // Optimized product loading with error handling
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getAllProducts();
      
      if (result.success && result.data) {
        setProducts(result.data);
      } else {
        console.error("Failed to load products:", result.error);
        toast.error(result.error || "Failed to load products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Optimized toggle handlers with immediate UI updates
  const handleFeaturedToggle = useCallback(async (productId: string, featured: boolean) => {
    try {
      setIsUpdating(productId);
      
      // Update featured status in the UI immediately
      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? { ...product, featured } : product
        )
      );

      // Update in the backend
      const result = await updateProductFeatured(productId, featured);
      if (!result.success) {
        // Revert UI change if backend update fails
        setProducts(prev => 
          prev.map(product => 
            product.id === productId ? { ...product, featured: !featured } : product
          )
        );
        toast.error(result.error || "Failed to update featured status");
      } else {
        toast.success(`Product ${featured ? 'marked as' : 'removed from'} featured`);
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
      // Revert UI change
      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? { ...product, featured: !featured } : product
        )
      );
    } finally {
      setIsUpdating(null);
    }
  }, []);

  const handleBestSellerToggle = useCallback(async (productId: string, bestSeller: boolean) => {
    try {
      setIsUpdating(productId);
      
      // Find the product to show better feedback
      const product = products.find(p => p.id === productId);
      const productTitle = product?.title || 'Unknown Product';
      
      // Update best seller status in the UI immediately for better UX
      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? { ...product, bestSeller } : product
        )
      );
      
      // Update in the backend
      const result = await updateProductBestSeller(productId, bestSeller);
      
      if (!result.success) {
        // Revert UI change if backend update fails
        setProducts(prev => 
          prev.map(product => 
            product.id === productId ? { ...product, bestSeller: !bestSeller } : product
          )
        );
        
        toast.error(result.error || "Failed to update best seller status");
      } else {
        toast.success(`${productTitle} ${bestSeller ? 'marked as' : 'removed from'} best sellers!`);
      }
    } catch (error) {
      console.error("Error updating best seller status:", error);
      toast.error("Failed to update best seller status");
      
      // Revert UI change
      setProducts(prev => 
        prev.map(product => 
          product.id === productId ? { ...product, bestSeller: !bestSeller } : product
        )
      );
    } finally {
      setIsUpdating(null);
    }
  }, [products]);

  const handleEditClick = useCallback((productId: string) => {
    router.push(`/products/${productId}`);
  }, [router]);

  const handleDeleteClick = useCallback((productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (productToDelete) {
      try {
        // Remove from UI immediately
        setProducts(prev => prev.filter(p => p.id !== productToDelete));
        setDeleteDialogOpen(false);

        // Delete from backend
        const result = await deleteProduct(productToDelete);
        if (!result.success) {
          // Revert UI change if backend delete fails
          loadProducts();
          toast.error(result.error || "Failed to delete product");
        } else {
          toast.success("Product deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
        loadProducts();
      }
      setProductToDelete(null);
    }
  }, [productToDelete, loadProducts]);

  // Calculate stats efficiently
  const stats = useMemo(() => {
    const total = products.length;
    const featured = products.filter(p => p.featured).length;
    const bestSellers = products.filter(p => p.bestSeller).length;
    
    return { total, featured, bestSellers };
  }, [products]);

  // Format sizes efficiently
  const formatSizes = useCallback((sizes: ProductSize[]) => {
    return sizes
      .map((size) => `${size.size}: ₹${size.price.toLocaleString()}`)
      .join(", ");
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading Products..." className="text-orange-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog and settings</p>
        </div>
        <Button onClick={() => router.push("/products/new")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Products</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featured}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Sellers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestSellers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="aspect-square overflow-hidden rounded-lg mb-3">
                <img
                  src={product.mainImage || "/placeholder.jpg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
              <Badge variant="secondary" className="w-fit">
                {product.category}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <p className="line-clamp-2">{formatSizes(product.sizes)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`featured-${product.id}`} className="text-sm">
                    Featured
                  </Label>
                  <Switch
                    id={`featured-${product.id}`}
                    checked={product.featured}
                    onCheckedChange={(checked) => handleFeaturedToggle(product.id, checked)}
                    disabled={isUpdating === product.id}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor={`bestSeller-${product.id}`} className="text-sm">
                    Best Seller
                  </Label>
                  <Switch
                    id={`bestSeller-${product.id}`}
                    checked={product.bestSeller}
                    onCheckedChange={(checked) => handleBestSellerToggle(product.id, checked)}
                    disabled={isUpdating === product.id}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(product.id)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(product.id)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `No products match "${searchTerm}". Try adjusting your search.`
              : 'Get started by adding your first product.'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => router.push("/products/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
