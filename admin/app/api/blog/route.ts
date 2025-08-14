import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import slugify from "slugify";

// GET - Fetch all blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate slug from title
    const slug = slugify(data.title, { lower: true, strict: true });

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this title already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug
      }
    });

    return NextResponse.json({
      success: true,
      post
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
