"use server";

import { currentUser } from "@clerk/nextjs/server";
import  db  from "@/lib/prisma";

export async function createUserIfNotExists() {
  const user = await currentUser();

  if (!user) return;

  // Try to get the name from multiple sources
  let fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  
  // If no name from firstName/lastName, try username or extract from email
  if (!fullName) {
    fullName = user.username || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User";
  }
  
  const email = user.emailAddresses[0]?.emailAddress ?? "";

  try {
    const dbUser = await db.user.upsert({
      where: {
        clerkId: user.id,
      },
      update: {
        name: fullName,
        email: email,
        image: user.imageUrl ?? "",
      },
      create: {
        clerkId: user.id,
        email: email,
        name: fullName,
        image: user.imageUrl ?? "",
        role: "USER",
      },
    });

    return dbUser;
  } catch (error) {
    console.error("❌ Error syncing user to database:", error);
    throw error;
  }
}
