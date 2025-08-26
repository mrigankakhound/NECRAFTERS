import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called"); // Debug log
    
    const contentType = request.headers.get('content-type') || '';
    
    let base64Image: string;
    let folder: string = "e-commerce/featured-reviews"; // Default folder
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const folderParam = formData.get('folder') as string;
      
      console.log("File received:", file?.name, file?.type, file?.size); // Debug log
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        );
      }

      // Validate file size (max 20MB - will be compressed client-side if larger)
      if (file.size > 20 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'File size too large. Maximum 20MB allowed. Please compress your image first using the compression tools.' },
          { status: 400 }
        );
      }

      // Convert File to base64 for Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
      
      if (folderParam) {
        folder = `e-commerce/${folderParam}`;
      }
      
    } else if (contentType.includes('application/json')) {
      // Handle base64 string upload
      const body = await request.json();
      base64Image = body.image;
      folder = body.folder ? `e-commerce/${body.folder}` : "e-commerce/featured-reviews";
      
      if (!base64Image) {
        return NextResponse.json(
          { error: 'No image data provided' },
          { status: 400 }
        );
      }
      
      console.log("Base64 image received for folder:", folder);
      
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type. Use multipart/form-data or application/json' },
        { status: 400 }
      );
    }

    try {
      console.log("Uploading to Cloudinary...");
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: folder,
        resource_type: "image",
        transformation: [
          { width: 400, height: 300, crop: "fill" },
          { quality: "auto" }
        ]
      });
      
      console.log("Cloudinary upload successful:", result.secure_url);

      return NextResponse.json({
        url: result.secure_url,
        public_id: result.public_id
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return NextResponse.json(
        { error: 'Failed to upload to Cloudinary' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
