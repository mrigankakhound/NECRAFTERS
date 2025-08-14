export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
