"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Settings,
  Star
} from "lucide-react";
import { 
  getFeaturedReviews, 
  createFeaturedReview, 
  updateFeaturedReview, 
  deleteFeaturedReview,
  toggleFeaturedReviewsSection,
  updateFeaturedReviewsConfig,
  reorderFeaturedReviews,
  getFeaturedReviewsSectionConfig,
  type FeaturedReview,
  type CreateFeaturedReviewData
} from "@/app/actions/featured-reviews.actions";
import { uploadImage } from "@/lib/cloudinary";

export default function FeaturedReviewsPage() {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<FeaturedReview | null>(null);
  const [sectionConfig, setSectionConfig] = useState({
    title: "Featured Reviews",
    subtitle: "Discover what our customers are saying about our products"
  });
  const [isSectionActive, setIsSectionActive] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<CreateFeaturedReviewData>({
    title: "",
    description: "",
    image: { url: "", public_id: "" },
    link: "",
    order: 0,
    customerName: "",
    rating: 5,
    reviewText: "",
    productName: ""
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      
      // Load both reviews and section configuration
      const [reviewsResult, configResult] = await Promise.all([
        getFeaturedReviews(),
        getFeaturedReviewsSectionConfig()
      ]);
      
      if (reviewsResult.success) {
        const mappedReviews = reviewsResult.data?.map(review => ({
          ...review,
          description: review.description || undefined,
          customerName: review.customerName || undefined,
          reviewText: review.reviewText || undefined,
          productName: review.productName || undefined,
          image: {
            url: review.image.url || undefined,
            public_id: review.image.public_id || undefined
          }
        })) || [];
        setReviews(mappedReviews);
      } else {
        toast.error(reviewsResult.error || "Failed to load reviews");
      }
      
      if (configResult.success && configResult.data) {
        const config = configResult.data;
        setSectionConfig({
          title: config.title,
          subtitle: config.subtitle || ""
        });
        setIsSectionActive(config.isActive);
      } else {
        // Set defaults if config loading fails
        setSectionConfig({
          title: "Featured Reviews",
          subtitle: "Discover what our customers are saying about our products"
        });
        setIsSectionActive(false);
      }
    } catch (error) {
      toast.error("Failed to load featured reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image.url || !formData.link) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingReview) {
        const result = await updateFeaturedReview(editingReview.id, formData);
        if (result.success) {
          toast.success("Review updated successfully");
        } else {
          toast.error(result.error || "Failed to update review");
        }
      } else {
        const result = await createFeaturedReview({
          ...formData,
          order: reviews.length
        });
        if (result.success) {
          toast.success("Review created successfully");
        } else {
          toast.error(result.error || "Failed to create review");
        }
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadReviews();
    } catch (error) {
      toast.error("Failed to save review");
    }
  };

  const handleEdit = (review: FeaturedReview) => {
    setEditingReview(review);
    setFormData({
      title: review.title,
      description: review.description || "",
      image: {
        url: review.image.url || "",
        public_id: review.image.public_id || ""
      },
      link: review.link,
      order: review.order,
      customerName: review.customerName || "",
      rating: review.rating,
      reviewText: review.reviewText || "",
      productName: review.productName || ""
    });
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    resetForm();
    // Force file input to reset by changing the key
    setFormData(prev => ({ ...prev, image: { url: "", public_id: "" } }));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        const result = await deleteFeaturedReview(id);
        if (result.success) {
          toast.success("Review deleted successfully");
          loadReviews();
        } else {
          toast.error(result.error || "Failed to delete review");
        }
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };

  const processImageFile = async (file: File) => {
    console.log("Processing file:", file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, etc.)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    try {
      const loadingToast = toast.loading("Uploading image...");
      
      // Convert File to base64 for server-side upload
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          try {
            const base64Image = e.target.result as string;
            const result = await uploadImage(base64Image, "featured-reviews");
            console.log("Upload result:", result);
            
            setFormData(prev => ({
              ...prev,
              image: { url: result.url, public_id: result.public_id }
            }));
            
            toast.dismiss(loadingToast);
            toast.success("Image uploaded successfully!");
            
            // Reset the file input to allow selecting the same file again
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } catch (uploadError) {
            toast.dismiss(loadingToast);
            toast.error("Failed to upload image. Please try again.");
            console.error("Upload error:", uploadError);
          }
        }
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      toast.error("Failed to process image. Please try again.");
      console.error("Processing error:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processImageFile(files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: { url: "", public_id: "" },
      link: "",
      order: 0,
      customerName: "",
      rating: 5,
      reviewText: "",
      productName: ""
    });
    setEditingReview(null);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newReviews = [...reviews];
    const [movedItem] = newReviews.splice(fromIndex, 1);
    newReviews.splice(toIndex, 0, movedItem);
    
    setReviews(newReviews);
    
    try {
      const result = await reorderFeaturedReviews(newReviews.map(r => r.id));
      if (result.success) {
        toast.success("Order updated successfully");
      } else {
        toast.error(result.error || "Failed to update order");
        loadReviews(); // Reload original order
      }
    } catch (error) {
      toast.error("Failed to update order");
      loadReviews(); // Reload original order
    }
  };

  const handleSectionToggle = async (isActive: boolean) => {
    try {
      const result = await toggleFeaturedReviewsSection(isActive);
      if (result.success) {
        setIsSectionActive(isActive);
        toast.success(`Section ${isActive ? 'enabled' : 'disabled'} successfully`);
      } else {
        toast.error(result.error || "Failed to toggle section");
        // Revert the toggle if it failed
        setIsSectionActive(!isActive);
      }
    } catch (error) {
      toast.error("Failed to toggle section");
      // Revert the toggle if it failed
      setIsSectionActive(!isActive);
    }
  };

  const handleConfigUpdate = async () => {
    try {
      const result = await updateFeaturedReviewsConfig(sectionConfig.title, sectionConfig.subtitle);
      if (result.success) {
        toast.success("Section configuration updated successfully");
      } else {
        toast.error(result.error || "Failed to update section configuration");
      }
    } catch (error) {
      toast.error("Failed to update section configuration");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading featured reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Featured Reviews Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </div>

      {/* Section Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Section Configuration
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            The section will be visible on the frontend only when at least one review is active. 
            You can toggle individual reviews on/off or use the section toggle to control all reviews at once.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input
                id="sectionTitle"
                value={sectionConfig.title}
                onChange={(e) => setSectionConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Featured Reviews"
              />
            </div>
            <div>
              <Label htmlFor="sectionSubtitle">Section Subtitle</Label>
              <Input
                id="sectionSubtitle"
                value={sectionConfig.subtitle}
                onChange={(e) => setSectionConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Discover what our customers are saying"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isSectionActive}
                onCheckedChange={handleSectionToggle}
              />
              <Label>Section Active</Label>
              <span className="text-sm text-gray-500 ml-2">
                {isSectionActive 
                  ? "Section is visible on the frontend" 
                  : "Section is hidden from the frontend"
                }
              </span>
            </div>
            <Button onClick={handleConfigUpdate}>Update Configuration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({reviews.length}/4)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                </div>
                
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                  {review.image.url ? (
                    <img
                      src={review.image.url}
                      alt={review.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{review.title}</h3>
                  {review.description && (
                    <p className="text-sm text-gray-600">{review.description}</p>
                  )}
                  <p className="text-sm text-blue-600">{review.link}</p>
                  
                  {/* Customer Review Info */}
                  <div className="mt-2 space-y-1">
                    {review.customerName && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Customer:</span> {review.customerName}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">Rating:</span>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    {review.productName && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Product:</span> {review.productName}
                      </p>
                    )}
                    {review.reviewText && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        "{review.reviewText}"
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={review.isActive}
                      onCheckedChange={async (checked) => {
                        try {
                          const result = await updateFeaturedReview(review.id, { isActive: checked });
                          if (result.success) {
                            setReviews(prevReviews => 
                              prevReviews.map(r => 
                                r.id === review.id ? { ...r, isActive: checked } : r
                              )
                            );
                            // Update section active state based on whether any reviews are active
                            const updatedReviews = reviews.map(r => 
                              r.id === review.id ? { ...r, isActive: checked } : r
                            );
                            const hasActiveReviews = updatedReviews.some(r => r.isActive);
                            setIsSectionActive(hasActiveReviews);
                            toast.success(`Review ${checked ? 'activated' : 'deactivated'}`);
                          } else {
                            toast.error(result.error || "Failed to update review status");
                          }
                        } catch (error) {
                          toast.error("Failed to update review status");
                        }
                      }}
                    />
                    <span className="text-xs text-gray-500">
                      {review.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(review)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No reviews added yet. Click "Add Review" to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? "Edit Review" : "Add New Review"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Review title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Review description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="image">Image *</Label>
              <div className="mt-1">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-2">
                    <div className="text-gray-600">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <label htmlFor="image" className="cursor-pointer">
                        <span className="font-medium text-blue-600 hover:text-blue-500">
                          Click to upload
                        </span>
                        {' '}or drag and drop
                      </label>
                      <Input
                        ref={fileInputRef}
                        id="image"
                        key={formData.image.url || 'no-image'}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        required={!formData.image.url}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WebP up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              {formData.image.url && (
                <div className="mt-3">
                  <div className="relative inline-block">
                    <img
                      src={formData.image.url}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, image: { url: "", public_id: "" } }))}
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-red-500 text-white hover:bg-red-600 border-0"
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 mt-1">✓ Image uploaded successfully</p>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="link">Link *</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="Product or category URL"
                required
              />
            </div>
            
            {/* Customer Review Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Customer name (optional)"
                />
              </div>
              
              <div>
                <Label htmlFor="rating">Rating *</Label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                placeholder="Product name (optional)"
              />
            </div>
            
            <div>
              <Label htmlFor="reviewText">Customer Review Text</Label>
              <Textarea
                id="reviewText"
                value={formData.reviewText}
                onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                placeholder="Customer's review text (optional)"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingReview ? "Update Review" : "Add Review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
