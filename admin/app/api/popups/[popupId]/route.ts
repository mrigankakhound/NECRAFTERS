import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const popupId = url.pathname.split('/').pop();
    
    if (!popupId) {
      return new NextResponse("Invalid popup ID", { status: 400 });
    }

    const popup = await prisma.shopPopup.findUnique({
      where: {
        id: popupId
      }
    });

    if (!popup) {
      return new NextResponse("Popup not found", { status: 404 });
    }

    return NextResponse.json(popup);
  } catch (error) {
    console.error('[POPUP_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const popupId = url.pathname.split('/').pop();
    
    if (!popupId) {
      return new NextResponse("Invalid popup ID", { status: 400 });
    }

    const body = await request.json();
    const popup = await prisma.shopPopup.update({
      where: {
        id: popupId
      },
      data: body
    });
    return NextResponse.json(popup);
  } catch (error) {
    console.error('[POPUP_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const popupId = url.pathname.split('/').pop();
    
    if (!popupId) {
      return new NextResponse("Invalid popup ID", { status: 400 });
    }

    const popup = await prisma.shopPopup.delete({
      where: {
        id: popupId
      }
    });
    return NextResponse.json(popup);
  } catch (error) {
    console.error('[POPUP_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}