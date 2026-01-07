
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getPlaygroundById, SaveUpdatedCode } from '@/modules/playground/actions';
import type { TemplateFolder } from '@/modules/playground/libs/path-to-json';

interface PlaygroundData {
  id: string;
  name?: string;
  [key: string]: any;
}

interface UsePlaygroundReturn {
  playgroundData: PlaygroundData | null;
  templateData: TemplateFolder | null;
  isLoading: boolean;
  error: string | null;
  loadPlayground: () => Promise<void>;
  saveTemplateData: (data: TemplateFolder) => Promise<void>;
}

export const usePlayground = (id: string): UsePlaygroundReturn => {
  const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(null);
  const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayground = useCallback(async () => {
    if (!id) {
      setError("No playground ID provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getPlaygroundById(id);
      
      if (!data) {
        throw new Error("Playground not found");
      }

      setPlaygroundData(data);

      // Check if template files exist and have content
      const templateFile = data.templateFiles?.[0];
      if (templateFile?.content) {
        // MongoDB stores JSON as object, not string
        const content = templateFile.content;
        if (typeof content === "string") {
          setTemplateData(JSON.parse(content));
        } else {
          // Already an object (MongoDB JSON type)
          setTemplateData(content as unknown as TemplateFolder);
        }
        toast.success("Playground loaded successfully");
        return;
      }

      // Load template from API if not in saved content
      const res = await fetch(`/api/template/${id}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to load template: ${res.status} - ${errorText}`);
      }

      const templateRes = await res.json();
      if (templateRes.templateJson && Array.isArray(templateRes.templateJson)) {
        setTemplateData({
          folderName: "Root",
          items: templateRes.templateJson,
        });
      } else {
        setTemplateData(templateRes.templateJson || {
          folderName: "Root",
          items: [],
        });
      }

      toast.success("Template loaded successfully");
    } catch (error) {
      console.error("Error loading playground:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load playground data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const saveTemplateData = useCallback(async (data: TemplateFolder) => {
    try {
      await SaveUpdatedCode(id, data);
      setTemplateData(data);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Error saving template data:", error);
      toast.error("Failed to save changes");
      throw error;
    }
  }, [id]);

  useEffect(() => {
    loadPlayground();
  }, [loadPlayground]);

  return {
    playgroundData,
    templateData,
    isLoading,
    error,
    loadPlayground,
    saveTemplateData,
  };
};
