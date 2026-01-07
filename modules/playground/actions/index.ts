"use server";

import db from "@/lib/prisma";
import { log } from "node:console";

export const getPlaygroundById = async (id: string) => {
  try {
    const Playground = await db.playground.findUnique({
      where: { id },
      select: {
        templateFiles: {
          select: { content: true },    
        },
      },
    });
    return Playground;
  } catch (error) {
    log("Error fetching playground:", error);
  }
};
