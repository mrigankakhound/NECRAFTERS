"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteImage } from "@/lib/cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createCategory(data: { name: string; image: File }) {
  try {
    // Convert File to base64 for Cloudinary
    const bytes = await data.image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${data.image.type};base64,${buffer.toString('base64')}`;
    
    // Upload image to Cloudinary
    const imageResult = await cloudinary.uploader.upload(base64Image, {
      folder: "e-commerce/categories",
      resource_type: "image",
      transformation: [
        { width: 400, height: 300, crop: "fill" },
        { quality: "auto" }
      ]
    });

    // Create category in database
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
        images: [
          {
            url: imageResult.secure_url,
            public_id: imageResult.public_id,
          },
        ],
      },
    });

    revalidatePath("/categories");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name: string;
    image?: File;
    oldImagePublicId?: string;
  }
) {
  try {
    let imageData = undefined;

    // If new image is provided, upload it and delete old one
    if (data.image) {
      // Convert File to base64 for Cloudinary
      const bytes = await data.image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${data.image.type};base64,${buffer.toString('base64')}`;
      
      const imageResult = await cloudinary.uploader.upload(base64Image, {
        folder: "e-commerce/categories",
        resource_type: "image",
        transformation: [
          { width: 400, height: 300, crop: "fill" },
          { quality: "auto" }
        ]
      });
      
      if (data.oldImagePublicId) {
        await deleteImage(data.oldImagePublicId);
      }
      imageData = [
        {
          url: imageResult.secure_url,
          public_id: imageResult.public_id,
        },
      ];
    }

    // Update category in database
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
        ...(imageData && { images: imageData }),
      },
    });

    revalidatePath("/categories");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string, imagePublicId: string) {
  try {
    // Delete image from Cloudinary
    await deleteImage(imagePublicId);

    // Delete category from database
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
