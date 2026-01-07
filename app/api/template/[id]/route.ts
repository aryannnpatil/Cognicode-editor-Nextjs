import {
  readTemplateStructureFromJson,
  saveTemplateStructureToJson,
  TemplateFile,
  TemplateFolder,
} from "@/modules/playground/libs/path-to-json";
import db from "@/lib/prisma";
import { templatePaths } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";


function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data)); // Ensures it's serializable
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) { 
    try {
        const { id } = await params;
        
        if (!id) {
            return Response.json({ error: "Missing Playground ID" }, { status: 400 });
        }

        const playground = await db.playground.findUnique({
            where: { id },
        });
        
        if (!playground) {
            return Response.json({ error: "Playground not found" }, { status: 404 });
        }

        const templatekey = playground.template as keyof typeof templatePaths;
        const templatePath = templatePaths[templatekey];

        if (!templatePath) {
            return Response.json({ 
                error: `Template path not found for template: ${templatekey}` 
            }, { status: 404 });
        }

        const inputPath = path.join(process.cwd(), templatePath);
        const outputFile = path.join(process.cwd(), `output/${templatekey}.json`);

        await saveTemplateStructureToJson(inputPath, outputFile);
        const result = await readTemplateStructureFromJson(outputFile);

        if (!validateJsonStructure(result.items)) {
            await fs.unlink(outputFile).catch(() => {}); // Clean up even on error
            return Response.json({ error: "Invalid template JSON structure" }, { status: 500 });
        }
        
        await fs.unlink(outputFile).catch(() => {}); // Don't fail if delete fails

        return Response.json({ success: true, templateJson: result.items }, { status: 200 });
         
    } catch (error) {
        console.error("Error in template API:", error);
        const errorMessage = error instanceof Error ? error.message : "Error reading template structure";
        return Response.json({ error: errorMessage }, { status: 500 });
    }
}


