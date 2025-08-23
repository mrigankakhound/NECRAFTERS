export const uploadImage = async (file: File) => {
  try {
    console.log("UploadImage called with file:", file.name, file.type, file.size); // Debug log
    
    const formData = new FormData();
    formData.append('file', file);

    // Get the base URL for server-side requests
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const uploadUrl = `${baseUrl}/api/upload`;
    
    console.log("Sending request to:", uploadUrl); // Debug log
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    console.log("Response status:", response.status); // Debug log

    if (!response.ok) throw new Error('Upload failed');

    const data = await response.json();
    console.log("Response data:", data); // Debug log
    
    // Return both url and public_id as expected by Featured Reviews
    return {
      url: data.url,
      public_id: data.public_id || `upload-${Date.now()}`
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
