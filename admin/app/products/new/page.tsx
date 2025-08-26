"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Plus, Upload } from "lucide-react";
import { SimpleImageUpload } from "@/components/ui/simple-image-upload";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import {
  createProduct,
  getAllCategories,
  getSubcategoriesByCategory,
} from "@/app/actions/product.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import slugify from "slugify";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Size {
  size: string;
  quantity: number;
  price: number;
}

interface ProductImage {
  id: string;
  url: string;
  file?: File;
}

interface Category {
  id: string;
  name: string;
  subCategories: {
    id: string;
    name: string;
  }[];
}

interface SubCategory {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    brand: "",
    sku: "",
    discount: "",
    categoryId: "",
    subcategoryIds: [] as string[],
    featured: false,
    longDescription: "",
  });

  const [sizes, setSizes] = useState<Size[]>([
    { size: "", quantity: 0, price: 0 },
  ]);

  const [benefits, setBenefits] = useState<string[]>([""]);
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [systemStatus, setSystemStatus] = useState<{ status: string; message: string } | null>(null);
  useEffect(() => {
    loadCategories();
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      setSystemStatus({
        status: 'pending',
        message: 'Checking system status...'
      });

      // First check environment variables
      const envResponse = await fetch('/api/check-env');
      if (!envResponse.ok) {
        throw new Error(`Environment check failed: ${envResponse.status}`);
      }
      
      const envData = await envResponse.json();
      
      if (!envData.success) {
        throw new Error(envData.error || 'Environment check failed');
      }

      // Check if there are missing environment variables
      const hasMissingEnv = envData.missing && envData.missing.length > 0;
      
      if (hasMissingEnv) {
        setSystemStatus({
          status: 'warning',
          message: `Missing environment variables: ${envData.missing.join(', ')}. This may cause product creation to fail.`
        });
        return;
      }

      // If environment is good, test the system health
      try {
        const healthResponse = await fetch('/api/test-product-creation', {
          method: 'POST'
        });
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          if (healthData.success) {
            const hasErrors = Object.values(healthData.results).some((result: any) => result.status === 'error');
            if (hasErrors) {
              setSystemStatus({
                status: 'warning',
                message: 'Some system components have issues. Check the troubleshooting guide for details.'
              });
            } else {
              setSystemStatus({
                status: 'success',
                message: 'All system components are working properly. Product creation should work correctly.'
              });
            }
          } else {
            setSystemStatus({
              status: 'warning',
              message: 'System health check failed. Some features may not work properly.'
            });
          }
        } else {
          setSystemStatus({
            status: 'warning',
            message: 'System health check unavailable. Basic environment check passed.'
          });
        }
      } catch (healthError) {
        // If health check fails, but environment is good, show warning
        setSystemStatus({
          status: 'warning',
          message: 'Environment variables are set, but system health check failed. Product creation may still work.'
        });
      }
      
    } catch (error) {
      console.error('System status check failed:', error);
      setSystemStatus({
        status: 'error',
        message: `Failed to check system status: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  useEffect(() => {
    if (productData.categoryId) {
      loadSubcategories(productData.categoryId);
    }
  }, [productData.categoryId]);

  const loadCategories = async () => {
    const result = await getAllCategories();
    if (result.success && result.data) {
      setCategories(
        result.data.map((category) => ({
          id: category.id,
          name: category.name,
          subCategories: category.subCategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
          })),
        }))
      );
    } else {
      toast.error("Failed to load categories");
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    const result = await getSubcategoriesByCategory(categoryId);
    if (result.success && result.data) {
      setSubcategories(
        result.data.map((sub) => ({
          id: sub.id,
          name: sub.name,
        }))
      );
    } else {
      toast.error("Failed to load subcategories");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (
    index: number,
    field: keyof Size,
    value: string
  ) => {
    const newSizes = [...sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === "size" ? value : Number(value),
    };
    setSizes(newSizes);
  };

  const addSize = () => {
    setSizes([...sizes, { size: "", quantity: 0, price: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleArrayInputChange = (
    index: number,
    value: string,
    type: "benefits" | "ingredients"
  ) => {
    const array = type === "benefits" ? [...benefits] : [...ingredients];
    array[index] = value;
    type === "benefits" ? setBenefits(array) : setIngredients(array);
  };

  const addArrayItem = (type: "benefits" | "ingredients") => {
    type === "benefits"
      ? setBenefits([...benefits, ""])
      : setIngredients([...ingredients, ""]);
  };

  const removeArrayItem = (index: number, type: "benefits" | "ingredients") => {
    const array = type === "benefits" ? [...benefits] : [...ingredients];
    array.splice(index, 1);
    type === "benefits" ? setBenefits(array) : setIngredients(array);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(7),
                url: e.target?.result as string,
                file,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (
        !productData.title ||
        !productData.description ||
        !productData.sku ||
        !productData.categoryId
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (images.length === 0) {
        toast.error("Please upload at least one product image");
        return;
      }

      if (
        sizes.some(
          (size) => !size.size || size.quantity <= 0 || size.price <= 0
        )
      ) {
        toast.error("Please fill in all size details correctly");
        return;
      }

      // Create product
      const result = await createProduct({
        title: productData.title,
        description: productData.description,
        longDescription: productData.longDescription,
        brand: productData.brand || null,
        slug: slugify(productData.title, { lower: true }),
        benefits: benefits.filter((b) => b.trim()),
        ingredients: ingredients.filter((i) => i.trim()),
        sku: productData.sku,
        images: images.map((img) => img.url),
        sizes: sizes.map((s) => ({
          size: s.size,
          qty: s.quantity,
          price: s.price,
          sold: 0,
        })),
        discount: Number(productData.discount) || 0,
        featured: productData.featured,
        categoryId: productData.categoryId,
        subCategoryIds: productData.subcategoryIds,
      });

      if (result.success) {
        toast.success("Product created successfully");
        router.push("/products");
      } else {
        console.error("Product creation failed:", result.error);
        toast.error(result.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(`Failed to create product: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Create New Product</h1>
      
      {/* System Status Indicator */}
      {systemStatus && (
        <div className={`mb-6 p-4 rounded-lg border ${
          systemStatus.status === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
          systemStatus.status === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
          systemStatus.status === 'pending' ? 'bg-blue-50 border-blue-200 text-blue-800' :
          'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {systemStatus.status === 'pending' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
              <strong>System Status:</strong> {systemStatus.message}
            </div>
            <button
              onClick={checkSystemStatus}
              className="text-sm underline hover:no-underline"
              disabled={systemStatus.status === 'pending'}
            >
              {systemStatus.status === 'pending' ? 'Checking...' : 'Refresh Status'}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-8">
        {/* Left Column - Main Details */}
        <div className="flex-1 space-y-6">
          <Card className="p-6 space-y-4">
            <div>
              <Label htmlFor="title">Product Title*</Label>
              <Input
                id="title"
                name="title"
                value={productData.title}
                onChange={handleInputChange}
                placeholder="Enter product title"
              />
            </div>

            <div>
              <Label htmlFor="description">Short Description*</Label>
              <Textarea
                id="description"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Enter short description"
              />
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                value={productData.brand}
                onChange={handleInputChange}
                placeholder="Enter brand name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU*</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={productData.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={productData.discount}
                  onChange={handleInputChange}
                  placeholder="Enter discount"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category*</Label>
                <Select
                  value={productData.categoryId}
                  onValueChange={(value) =>
                    setProductData((prev) => ({
                      ...prev,
                      categoryId: value,
                      subcategoryIds: [],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategories</Label>
                <Select
                  value={productData.subcategoryIds[0] || ""}
                  onValueChange={(value) =>
                    setProductData((prev) => ({
                      ...prev,
                      subcategoryIds: [value],
                    }))
                  }
                  disabled={!productData.categoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={productData.featured}
                onCheckedChange={(checked) =>
                  setProductData((prev) => ({ ...prev, featured: checked }))
                }
              />
              <Label htmlFor="featured">Review of Food Enthusiasts</Label>
            </div>
          </Card>

          <Card className="p-6">
            <Label className="mb-4 block">Long Description*</Label>
            <ReactQuill
              value={productData.longDescription}
              onChange={(value) =>
                setProductData((prev) => ({ ...prev, longDescription: value }))
              }
              className="h-[200px] mb-12"
            />
          </Card>
        </div>

        {/* Right Column - Additional Details */}
        <div className="flex-1 space-y-6">
          <Card className="p-6">
            <Label className="mb-4 block">Sizes*</Label>
            {sizes.map((size, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Size"
                  value={size.size}
                  onChange={(e) =>
                    handleSizeChange(index, "size", e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={size.quantity}
                  onChange={(e) =>
                    handleSizeChange(index, "quantity", e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={size.price}
                  onChange={(e) =>
                    handleSizeChange(index, "price", e.target.value)
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSize(index)}
                  disabled={sizes.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addSize}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Size
            </Button>
          </Card>

          <Card className="p-6">
            <Label className="mb-4 block">Benefits</Label>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Enter benefit"
                  value={benefit}
                  onChange={(e) =>
                    handleArrayInputChange(index, e.target.value, "benefits")
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem(index, "benefits")}
                  disabled={benefits.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem("benefits")}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Benefit
            </Button>
          </Card>

          <Card className="p-6">
            <Label className="mb-4 block">Ingredients</Label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Enter ingredient"
                  value={ingredient}
                  onChange={(e) =>
                    handleArrayInputChange(index, e.target.value, "ingredients")
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem(index, "ingredients")}
                  disabled={ingredients.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => addArrayItem("ingredients")}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Ingredient
            </Button>
          </Card>

          <Card className="p-6">
            <Label className="mb-4 block">Product Images*</Label>
            <SimpleImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
              className="mt-2"
            />
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          variant="outline"
          className="mr-2"
          onClick={() => router.push("/products")}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </div>
  );
}
