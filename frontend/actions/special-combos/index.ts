import { prisma } from "@/lib/prisma";
import { OfferType } from "@prisma/client";

export async function getSpecialCombos() {
  try {
    const specialCombos = await prisma.homeScreenOffer.findMany({
      where: {
        type: OfferType.specialCombo,
      },
    });

    return {
      success: true,
      data: specialCombos,
    };
  } catch (error) {
    console.error("Error fetching special combos:", error);
    return {
      success: false,
      error: "Failed to fetch special combos",
    };
  }
}