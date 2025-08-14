import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const popups = await prisma.shopPopup.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(popups);
  } catch (error) {
    console.error('[POPUPS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const popup = await prisma.shopPopup.create({
      data: body
    });
    return NextResponse.json(popup);
  } catch (error) {
    console.error('[POPUPS_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
