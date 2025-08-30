"use server";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId");

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId.value },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    return null;
  }
}
