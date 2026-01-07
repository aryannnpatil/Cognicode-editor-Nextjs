import {
  readTemplateStructureFromJson,
  saveTemplateStructureToJson,
} from "@/modules/playground/libs/path-to-json";
import db from "@/lib/prisma";
import { templatePaths } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) { 
    const {id}=params;
    

    if (!id) {
        return Response.json({ error: "Playground not found" }, { status: 400 });
    }
}
