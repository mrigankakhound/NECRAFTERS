"use client";

import React, { useState, useCallback } from 'react';
import { Upload, X, FileDown, Info, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { 
  ImageCompressor, 
  ImageInfo, 
  CompressionResult, 
  CompressionOptions 
} from '@/lib/imageCompression';

interface EnhancedImageUploadProps {
  onImagesChange: (images: { id: string; url: string; file?: File }[]) => void;
  images: { id: string; url: string; file?: File }[];
  maxImages?: number;
  purpose?: 'product-thumbnail' | 'product-gallery' | 'hero-banner' | 'background' | 'default';
  showCompressionTools?: boolean;
  className?: string;
}

export const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  onImagesChange,
  images,
  maxImages = 10,
  purpose = 'default',
  showCompressionTools = true,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [imageAnalysis, setImageAnalysis] = useState<Map<string, ImageInfo>>(new Map());
  const [compressionResults, setCompressionResults] = useState<Map<string, CompressionResult>>(new Map());
  const [showSettings, setShowSettings] = useState(false);
  const [compressionSettings, setCompressionSettings] = useState<Partial<CompressionOptions>>({
    quality: 0.8,
    maxWidthOrHeight: 1920,
  });

  const analyzeImage = useCallback(async (file: File): Promise<ImageInfo> => {
    try {
      const info = await ImageCompressor.analyzeImage(file);
      return info;
    } catch (error) {
      console.error('Failed to analyze image:', error);
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        width: 0,
        height: 0,
        sizeInMB: file.size / (1024 * 1024),
        needsCompression: true,
        recommendedSize: 2,
      };
    }
  }, []);

  const handleFileSelect = useCallback(async (files: FileList) => {
    const newImages: { id: string; url: string; file?: File }[] = [];
    const analysisMap = new Map<string, ImageInfo>();
    
    for (let i = 0; i < files.length && images.length + newImages.length < maxImages; i++) {
      const file = files[i];
      const id = Math.random().toString(36).substring(7);
      
      // Analyze image
      const info = await analyzeImage(file);
      analysisMap.set(id, info);
      
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
            setImageAnalysis(analysisMap);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }, [images, maxImages, onImagesChange, analyzeImage]);

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
    
    // Clean up analysis and compression data
    const newAnalysis = new Map(imageAnalysis);
    const newResults = new Map(compressionResults);
    newAnalysis.delete(id);
    newResults.delete(id);
    setImageAnalysis(newAnalysis);
    setCompressionResults(newResults);
  }, [images, onImagesChange, imageAnalysis, compressionResults]);

  const compressImage = useCallback(async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image?.file) return;

    setIsCompressing(true);
    setCompressionProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setCompressionProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await ImageCompressor.compressImage(
        image.file, 
        purpose, 
        compressionSettings
      );

      clearInterval(progressInterval);
      setCompressionProgress(100);

      // Update compression results
      const newResults = new Map(compressionResults);
      newResults.set(imageId, result);
      setCompressionResults(newResults);

      // Replace the file with compressed version
      const newImages = images.map(img => 
        img.id === imageId 
          ? { ...img, file: result.compressedFile }
          : img
      );
      onImagesChange(newImages);

      // Update analysis
      const newAnalysis = new Map(imageAnalysis);
      const newInfo = await analyzeImage(result.compressedFile);
      newAnalysis.set(imageId, newInfo);
      setImageAnalysis(newAnalysis);

    } catch (error) {
      console.error('Compression failed:', error);
    } finally {
      setIsCompressing(false);
      setCompressionProgress(0);
    }
  }, [images, purpose, compressionSettings, compressionResults, imageAnalysis, onImagesChange, analyzeImage]);

  const compressAllImages = useCallback(async () => {
    setIsCompressing(true);
    setCompressionProgress(0);

    try {
      const imagesToCompress = images.filter(img => img.file);
      let processed = 0;

      for (const image of imagesToCompress) {
        if (image.file) {
          await compressImage(image.id);
          processed++;
          setCompressionProgress((processed / imagesToCompress.length) * 100);
        }
      }
    } catch (error) {
      console.error('Batch compression failed:', error);
    } finally {
      setIsCompressing(false);
      setCompressionProgress(0);
    }
  }, [images, compressImage]);

  const getImageStatus = (imageId: string) => {
    const info = imageAnalysis.get(imageId);
    const result = compressionResults.get(imageId);
    
    if (!info) return 'pending';
    if (result && result.compressionRatio > 0) return 'compressed';
    if (info.needsCompression) return 'needs-compression';
    return 'optimal';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compressed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'needs-compression':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'optimal':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compressed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-compression':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'optimal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Compression Settings */}
      {showCompressionTools && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Compression Settings
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? 'Hide' : 'Show'} Settings
            </Button>
          </div>
          
          {showSettings && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quality: {compressionSettings.quality ? Math.round(compressionSettings.quality * 100) : 80}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={compressionSettings.quality || 0.8}
                  onChange={(e) => setCompressionSettings(prev => ({ 
                    ...prev, 
                    quality: parseFloat(e.target.value) 
                  }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Dimension: {compressionSettings.maxWidthOrHeight || 1920}px
                </label>
                <input
                  type="range"
                  min="800"
                  max="3840"
                  step="160"
                  value={compressionSettings.maxWidthOrHeight || 1920}
                  onChange={(e) => setCompressionSettings(prev => ({ 
                    ...prev, 
                    maxWidthOrHeight: parseInt(e.target.value) 
                  }))}
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button
              onClick={compressAllImages}
              disabled={isCompressing || images.length === 0}
              className="flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Compress All Images
            </Button>
            {isCompressing && (
              <div className="flex-1">
                <Progress value={compressionProgress} className="h-2" />
                <p className="text-sm text-gray-600 mt-1">
                  Compressing... {Math.round(compressionProgress)}%
                </p>
              </div>
            )}
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
            const info = imageAnalysis.get(image.id);
            const result = compressionResults.get(image.id);
            const status = getImageStatus(image.id);
            
            return (
              <Card key={image.id} className="p-4">
                <div className="flex items-start gap-4">
                  {/* Image Preview */}
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.name || 'Product image'}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <Badge className={`absolute -top-2 -right-2 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </Badge>
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
                    
                    {info && (
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Size:</span> {ImageCompressor.formatFileSize(info.size)}
                          {result && (
                            <span className="text-green-600 ml-2">
                              → {ImageCompressor.formatFileSize(result.compressedSize)}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Dimensions:</span> {info.width} × {info.height}
                        </div>
                        <div>
                          <span className="font-medium">Format:</span> {info.type}
                          {ImageCompressor.isModernFormat(info.type) && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Modern
                            </Badge>
                          )}
                        </div>
                        {result && (
                          <div>
                            <span className="font-medium">Compression:</span> 
                            <span className="text-green-600 ml-1">
                              {result.compressionRatio}% smaller
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Compression Actions */}
                    {showCompressionTools && info?.needsCompression && !result && (
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => compressImage(image.id)}
                          disabled={isCompressing}
                          className="flex items-center gap-2"
                        >
                          <FileDown className="w-4 h-4" />
                          Compress Image
                        </Button>
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
