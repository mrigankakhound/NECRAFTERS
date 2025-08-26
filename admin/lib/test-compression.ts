import imageCompression from 'browser-image-compression';

export async function testCompression() {
  try {
    // Create a simple test image (this is just for testing the library)
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw a simple pattern
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 500, 500);
      ctx.fillStyle = 'blue';
      ctx.fillRect(500, 500, 500, 500);
    }
    
    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 0.9);
    });
    
    // Create a File object
    const testFile = new File([blob], 'test-image.jpg', { type: 'image/jpeg' });
    
    console.log('Test file created:', testFile.name, 'Size:', testFile.size / (1024 * 1024), 'MB');
    
    // Test compression
    const options = {
      maxSizeMB: 20,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: 0.8
    };
    
    console.log('Compression options:', options);
    
    const compressedFile = await imageCompression(testFile, options);
    
    console.log('Compression successful!');
    console.log('Original size:', testFile.size / (1024 * 1024), 'MB');
    console.log('Compressed size:', compressedFile.size / (1024 * 1024), 'MB');
    console.log('Compression ratio:', ((testFile.size - compressedFile.size) / testFile.size * 100).toFixed(2), '%');
    
    return {
      success: true,
      originalSize: testFile.size,
      compressedSize: compressedFile.size,
      compressionRatio: ((testFile.size - compressedFile.size) / testFile.size) * 100
    };
    
  } catch (error) {
    console.error('Compression test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
