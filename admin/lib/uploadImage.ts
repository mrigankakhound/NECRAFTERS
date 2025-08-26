export const uploadImage = async (file: File | string, folder?: string) => {
  try {
    console.log("UploadImage called with:", typeof file === 'string' ? 'base64 string' : `file: ${file.name}`, folder);
    
    let base64Image: string;
    let uploadFolder = folder || "featured-reviews";
    
    if (typeof file === 'string') {
      // Handle base64 string
      base64Image = file;
      console.log("Processing base64 image for folder:", uploadFolder);
    } else {
      // Handle File object
      console.log("Processing file:", file.name, file.type, file.size);
      
      // Convert File to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    // Get the base URL for server-side requests
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const uploadUrl = `${baseUrl}/api/upload`;
    
    console.log("Sending request to:", uploadUrl);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        folder: uploadFolder
      }),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Upload failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    
    // Return both url and public_id as expected
    return {
      url: data.url,
      public_id: data.public_id || `upload-${Date.now()}`
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
