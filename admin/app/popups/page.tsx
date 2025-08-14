import { format } from "date-fns";
import prisma from "@/lib/prisma";
import { PopupClient } from "./_components/client";

export default async function PopupsPage() {
  const popups = await prisma.shopPopup.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedPopups = popups.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isActive: item.isActive,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    imageUrl: item.imageUrl || null,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PopupClient data={formattedPopups} />
      </div>
    </div>
  );
}