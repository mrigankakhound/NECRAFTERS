import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
}

export interface CompressionResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  quality: number;
  format: string;
}

export interface ImageInfo {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  sizeInMB: number;
  needsCompression: boolean;
  recommendedSize: number;
}

export class ImageCompressor {
  private static readonly DEFAULT_OPTIONS: CompressionOptions = {
    maxSizeMB: 2, // Default to 2MB for good balance
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true,
    fileType: 'image/webp', // Prefer WebP for best compression
    quality: 0.8, // 80% quality
  };

  private static readonly SIZE_LIMITS = {
    'product-thumbnail': 1 * 1024 * 1024, // 1MB
    'product-gallery': 2 * 1024 * 1024,   // 2MB
    'hero-banner': 3 * 1024 * 1024,       // 3MB
    'background': 2 * 1024 * 1024,        // 2MB
    'default': 2 * 1024 * 1024,           // 2MB
  };

  /**
   * Analyze image and provide compression recommendations
   */
  static async analyzeImage(file: File): Promise<ImageInfo> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        const sizeInMB = file.size / (1024 * 1024);
        const recommendedSize = this.getRecommendedSize(file.type, img.width, img.height);
        const needsCompression = file.size > recommendedSize;
        
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          width: img.width,
          height: img.height,
          sizeInMB: Math.round(sizeInMB * 100) / 100,
          needsCompression,
          recommendedSize: recommendedSize / (1024 * 1024),
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          width: 0,
          height: 0,
          sizeInMB: file.size / (1024 * 1024),
          needsCompression: true,
          recommendedSize: 2,
        });
      };
      
      img.src = url;
    });
  }

  /**
   * Get recommended file size based on image type and dimensions
   */
  private static getRecommendedSize(mimeType: string, width: number, height: number): number {
    const area = width * height;
    
    if (mimeType.includes('webp') || mimeType.includes('avif')) {
      return Math.min(this.SIZE_LIMITS.default, area * 0.0001); // WebP/AVIF are more efficient
    } else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
      return Math.min(this.SIZE_LIMITS.default, area * 0.00015);
    } else if (mimeType.includes('png')) {
      return Math.min(this.SIZE_LIMITS.default, area * 0.0003); // PNG is larger
    }
    
    return this.SIZE_LIMITS.default;
  }

  /**
   * Compress image with smart options
   */
  static async compressImage(
    file: File, 
    purpose: keyof typeof this.SIZE_LIMITS = 'default',
    customOptions?: Partial<CompressionOptions>
  ): Promise<CompressionResult> {
    // Use custom options if provided, otherwise use purpose-based limits
    const targetSizeMB = customOptions?.maxSizeMB || (this.SIZE_LIMITS[purpose] || this.SIZE_LIMITS.default) / (1024 * 1024);
    
    const options: CompressionOptions = {
      ...this.DEFAULT_OPTIONS,
      maxSizeMB: targetSizeMB,
      ...customOptions,
    };

    // Determine best format based on original
    if (file.type.includes('png') && file.type.includes('transparency')) {
      options.fileType = 'image/png'; // Keep PNG if transparency is needed
    } else if (file.type.includes('jpeg') || file.type.includes('jpg')) {
      options.fileType = 'image/jpeg'; // Keep JPEG for photos
    } else {
      options.fileType = 'image/webp'; // Convert to WebP for best compression
    }

    try {
      const compressedFile = await imageCompression(file, options);
      
      const compressionRatio = ((file.size - compressedFile.size) / file.size) * 100;
      
      return {
        compressedFile,
        originalSize: file.size,
        compressedSize: compressedFile.size,
        compressionRatio: Math.round(compressionRatio * 100) / 100,
        quality: options.quality,
        format: options.fileType,
      };
    } catch (error) {
      console.error('Image compression failed:', error);
      throw new Error(`Failed to compress image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Batch compress multiple images
   */
  static async compressImages(
    files: File[], 
    purpose: keyof typeof this.SIZE_LIMITS = 'default'
  ): Promise<CompressionResult[]> {
    const results: CompressionResult[] = [];
    
    for (const file of files) {
      try {
        const result = await this.compressImage(file, purpose);
        results.push(result);
      } catch (error) {
        console.error(`Failed to compress ${file.name}:`, error);
        // Add original file as fallback
        results.push({
          compressedFile: file,
          originalSize: file.size,
          compressedSize: file.size,
          compressionRatio: 0,
          quality: 1,
          format: file.type,
        });
      }
    }
    
    return results;
  }

  /**
   * Get compression statistics
   */
  static getCompressionStats(results: CompressionResult[]): {
    totalOriginalSize: number;
    totalCompressedSize: number;
    averageCompressionRatio: number;
    totalSavings: number;
    totalSavingsMB: number;
  } {
    const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalCompressedSize = results.reduce((sum, r) => sum + r.compressedSize, 0);
    const totalSavings = totalOriginalSize - totalCompressedSize;
    const averageCompressionRatio = results.reduce((sum, r) => sum + r.compressionRatio, 0) / results.length;
    
    return {
      totalOriginalSize,
      totalCompressedSize,
      averageCompressionRatio: Math.round(averageCompressionRatio * 100) / 100,
      totalSavings,
      totalSavingsMB: Math.round((totalSavings / (1024 * 1024)) * 100) / 100,
    };
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if image format is modern and efficient
   */
  static isModernFormat(mimeType: string): boolean {
    return mimeType.includes('webp') || mimeType.includes('avif');
  }

  /**
   * Get recommended format for image type
   */
  static getRecommendedFormat(originalType: string, hasTransparency: boolean = false): string {
    if (hasTransparency) {
      return 'image/png'; // PNG for transparency
    } else if (originalType.includes('jpeg') || originalType.includes('jpg')) {
      return 'image/jpeg'; // Keep JPEG for photos
    } else {
      return 'image/webp'; // WebP for best compression
    }
  }
}
