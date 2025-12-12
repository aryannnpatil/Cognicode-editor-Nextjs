import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUserToDB() {
  const user = await currentUser();
  if (!user) return null;

  const email =
    user.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? null;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    update: {
      name: fullName,
      email,
      image: user.imageUrl,
    },
    create: {
      clerkId: user.id,
      name: fullName,
      email,
      image: user.imageUrl,
    },
  });

  console.log("User synced to DB ✔", dbUser);

  return dbUser;
}
