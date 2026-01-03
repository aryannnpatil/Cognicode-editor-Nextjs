"use server";

import db from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { error } from "console";
import { revalidatePath } from "next/cache";






export  const toggledStarMarked = async(playgroundId: string, isMarked: boolean) => {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      throw new Error("User not authenticated");
    }

    try {
      // Get the database user by Clerk ID
      const dbUser = await db.user.findUnique({
        where: {
          clerkId: clerkUser.id,
        },
      });

      if (!dbUser) {
        throw new Error("User not found in database");
      }

      if(isMarked) {
        await db.starMark.create({
          data: {
            playgroundId: playgroundId,
            userId: dbUser.id,
            isMarked: true,
          },
        });
      } else {
        await db.starMark.delete({
          where: {
            userId_playgroundId: {
              playgroundId: playgroundId, 
              userId: dbUser.id,
            },
          },
        });
      }
      revalidatePath("/dashboard");
      return { success: true, isMarked: isMarked };
    }
    catch (error) {
      console.error("Error toggling star mark:", error);
      return { success: false, error: "Failed to toggle star mark" };
    }  
}; 






export const getAllPlaygroundForUser = async () => {
  const clerkUser = await currentUser();
  
  if (!clerkUser) return [];

  try {
    // Get the database user by Clerk ID
    const dbUser = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
    });

    if (!dbUser) return [];

    const playground = await db.playground.findMany({
      where: {
        userId: dbUser.id,
      },
      include: {
        user: true,
        StarMark: { where: { userId: dbUser.id! } , select: { isMarked: true } },
      },
    });

    return playground;
  } catch (error) {
    console.log(error);
    return [];
  }
};


export const createPlayground= async (data:{
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR" | "DJANGO";
  description?: string;
}) => {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    throw new Error("User not authenticated");
  }

  const { title, template, description } = data;
  
  try {
    // Get the database user by Clerk ID
    const dbUser = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
    });

    if (!dbUser) {
      throw new Error("User not found in database");
    }

    const playground = await db.playground.create({
      data: {
        title,
        template,
        description,
        userId: dbUser.id,
      },
    });

    revalidatePath("/dashboard");
    return playground;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePlaygroundById = async (id: string) => {
  try {
    await db.playground.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
}


export const editPlaygroundById = async (id: string,data:{title:string, description: string}) => {
  try {
    await db.playground.update({
      where: {
        id,
      },
      data: data,
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  } 
}


export const duplicatePlaygroundbyId= async (id: string) => {
  try {
    const orignalPlayground = await db.playground.findUnique({
      where: {
        id,
      },
      //todo: add template files
    });
    if(!orignalPlayground) throw new Error("Playground not found");

    const duplicatedPlayground = await db.playground.create({
      data: {
        title: orignalPlayground.title + " Copy",
        description: orignalPlayground.description,
        template: orignalPlayground.template,
        userId: orignalPlayground.userId,

        //todo: add template files
      },
    });

    revalidatePath("/dashboard");
    return duplicatedPlayground;
  } catch (error) {
    console.log(error);
  }   
}
