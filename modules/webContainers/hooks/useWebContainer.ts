import { useState, useEffect, useCallback } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/modules/playground/libs/path-to-json";
import { set } from "date-fns";

interface useWebContainerProps {
  templateData: TemplateFolder;
}

interface useWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void;
}

export const useWebContainer = ({
  templateData,
}: useWebContainerProps): useWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initWebContainer() {
      try {
        setIsLoading(true);
        console.log("Booting WebContainer...");
        const webContainerInstance = await WebContainer.boot();

        if (!mounted) return;

        console.log("WebContainer booted successfully");
        setInstance(webContainerInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing WebContainer:", error);
        if (mounted) {
          setError(error instanceof Error ? error.message : String(error));
          setIsLoading(false);
        }
      }
    }
    initWebContainer();

    return () => {
      mounted = false;
      if (instance) {
        instance.teardown();
      }
    };
  }, []);

  const writeFileSync = useCallback(
    async (path: string, content: string) => {
      if (!instance) {
        throw new Error("WebContainer instance is not initialized");
      }

      try {
        const pathParts = path.split("/");
        const folderpath = pathParts.slice(0, -1).join("/");

        if (folderpath) {
          await instance.fs.mkdir(folderpath, { recursive: true });
        }

        await instance.fs.writeFile(path, content);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(`Error writing file at ${path}:`, errorMessage);
        throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
      }
    },
    [instance]
  );

  const destroy = useCallback(() => {
    if (instance) {
      instance.teardown();
      setInstance(null);
      setServerUrl(null);
    }
  }, [instance]);

  return{serverUrl, isLoading, error, instance, writeFileSync, destroy}


};
