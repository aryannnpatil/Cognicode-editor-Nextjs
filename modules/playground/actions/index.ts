"use server";

import db from "@/lib/prisma";
import { log } from "node:console";
import { TemplateFolder } from "../libs/path-to-json";
import { currentUser } from "@clerk/nextjs/server";

export const getPlaygroundById = async (id: string) => {
  try {
    const playground = await db.playground.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        template: true,
        templateFiles: {
          select: { content: true },    
        },
      },
    });
    return playground;
  } catch (error) {
    log("Error fetching playground:", error);
    throw new Error("Failed to fetch playground");
  }
};


export const SaveUpdatedCode = async (playgroundid: string, data: TemplateFolder) => {
    const user=await currentUser();
    if(!user){
        throw new Error("Unauthorized");
    }

    try {
        const updatedPlayground = await db.templateFiles.upsert({
            where: { playgroundId: playgroundid },
            update: {
                content: JSON.stringify(data),
            },
            create:{
                playgroundId:playgroundid,
                content: JSON.stringify(data),
            }
        });
        return updatedPlayground;
    }
    catch (error) {
        log("Error saving updated code:", error);
        throw error;
    }
}