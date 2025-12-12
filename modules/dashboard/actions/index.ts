"use server";

import db from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { error } from "console";

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();

  try {
    const playground = await db.playground.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        user: true,
      },
    });

    return playground;
  } catch (error) {}
    console.log(error);
      
};
