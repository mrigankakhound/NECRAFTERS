"use client";

import React, { useState, useCallback } from 'react';
import { Upload, X, FileDown, AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { ImageCompressor } from '@/lib/imageCompression';

interface SimpleImageUploadProps {
  onImagesChange: (images: { id: string; url: string; file?: File }[]) => void;
  images: { id: string; url: string; file?: File }[];
  maxImages?: number;
  className?: string;
  onCompressionComplete?: () => void;
}

export const SimpleImageUpload: React.FC<SimpleImageUploadProps> = ({
  onImagesChange,
  images,
  maxImages = 10,
  className = '',
  onCompressionComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [hasLargeImages, setHasLargeImages] = useState(false);

  const checkImageSizes = useCallback(() => {
    const largeImages = images.some(img => img.file && img.file.size > 10 * 1024 * 1024);
    setHasLargeImages(largeImages);
  }, [images]);

  // Check image sizes whenever images change
  React.useEffect(() => {
    checkImageSizes();
  }, [checkImageSizes]);

  const handleFileSelect = useCallback(async (files: FileList) => {
    const newImages: { id: string; url: string; file?: File }[] = [];
    
    for (let i = 0; i < files.length && images.length + newImages.length < maxImages; i++) {
      const file = files[i];
      const id = Math.random().toString(36).substring(7);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push({
            id,
            url: e.target.result as string,
            file,
          });
          
          if (newImages.length === files.length) {
            onImagesChange([...images, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }, [images, maxImages, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = useCallback((id: string) => {
    const newImages = images.filter(img => img.id !== id);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const compressAllImages = useCallback(async () => {
    setIsCompressing(true);

    try {
      const compressedImages: { id: string; url: string; file?: File }[] = [];
      
      for (const image of images) {
        if (image.file) {
          try {
            // Compress image to fit within 10MB limit
            const result = await ImageCompressor.compressImage(image.file, 'default', {
              maxSizeMB: 10,
              quality: 0.8,
            });
            
            // Create new preview for compressed image
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                compressedImages.push({
                  id: image.id,
                  url: e.target.result as string,
                  file: result.compressedFile,
                });
                
                             // Update images when all are compressed
             if (compressedImages.length === images.length) {
               onImagesChange(compressedImages);
               // Notify parent that compression is complete
               if (onCompressionComplete) {
                 onCompressionComplete();
               }
             }
              }
            };
            reader.readAsDataURL(result.compressedFile);
            
          } catch (error) {
            console.error(`Failed to compress ${image.file.name}:`, error);
            // Keep original image if compression fails
            compressedImages.push(image);
          }
        } else {
          // Keep images without files (already uploaded)
          compressedImages.push(image);
        }
      }
      
    } catch (error) {
      console.error('Compression failed:', error);
    } finally {
      setIsCompressing(false);
    }
  }, [images, onImagesChange]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Compression Warning and Button */}
      {hasLargeImages && (
        <Card className="p-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  Some images exceed 10MB limit
                </p>
                <p className="text-sm text-yellow-700">
                  Compress images before creating product
                </p>
              </div>
            </div>
            <Button
              onClick={compressAllImages}
              disabled={isCompressing}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isCompressing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Compressing...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 mr-2" />
                  Compress Images
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Upload Area */}
      <Card className={`p-6 border-2 border-dashed transition-colors ${
        isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-300 hover:border-gray-400'
      }`}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="text-center"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-gray-500 mb-4">
            PNG, JPG, GIF, WebP up to 50MB (will be compressed automatically)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button asChild>
              <span>Choose Images</span>
            </Button>
          </label>
        </div>
      </Card>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Selected Images ({images.length}/{maxImages})
          </h3>
          
          {images.map((image) => {
            const isLarge = image.file && image.file.size > 10 * 1024 * 1024;
            
            return (
              <Card key={image.id} className="p-4">
                <div className="flex items-start gap-4">
                  {/* Image Preview */}
                  <div className="relative">
                    <img
                      src={image.url}
                      alt="Product image"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    {isLarge && (
                      <Badge className="absolute -top-2 -right-2 bg-red-100 text-red-800 border-red-200">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Large
                      </Badge>
                    )}
                  </div>
                  
                  {/* Image Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{image.file?.name || 'Image'}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {image.file && (
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Size:</span> {formatFileSize(image.file.size)}
                          {isLarge && (
                            <span className="text-red-600 ml-2 font-medium">
                              (Exceeds 10MB limit)
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {image.file.type}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
