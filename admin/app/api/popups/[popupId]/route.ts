import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  { params }: { params: { popupId: string } },
  req: Request
) {
  try {
    const popup = await prisma.shopPopup.findUnique({
      where: {
        id: params.popupId
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

export async function PATCH(
  { params }: { params: { popupId: string } },
  req: Request
) {
  try {
    const body = await req.json();
    const popup = await prisma.shopPopup.update({
      where: {
        id: params.popupId
      },
      data: body
    });
    return NextResponse.json(popup);
  } catch (error) {
    console.error('[POPUP_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  { params }: { params: { popupId: string } },
  req: Request
) {
  try {
    const popup = await prisma.shopPopup.delete({
      where: {
        id: params.popupId
      }
    });
    return NextResponse.json(popup);
  } catch (error) {
    console.error('[POPUP_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}