"use client";

import React, { useEffect, useState, useRef } from "react";
import { transformToWebContainerFormat } from "../hooks/transformer";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { TemplateFolder } from "@/modules/playground/libs/path-to-json";
import { WebContainer } from "@webcontainer/api";
import { set } from "date-fns";
import { se } from "date-fns/locale";

interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  serverUrl: string;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  forceResetup?: boolean;
}

const WebContainerPreview = ({
  templateData,
  serverUrl,
  isLoading,
  error,
  instance,
  writeFileSync,
  forceResetup = false,
}: WebContainerPreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loadingState, setLoadingState] = useState({
    transforming: false,
    mounting: false,
    installing: false,
    starting: false,
    ready: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);

  useEffect(() => {
    async function setupWebContainer() {
      if (!instance || isSetupComplete || isSetupInProgress) return;

      try {
        setIsSetupInProgress(true);
        setSetupError(null);

        // Check if already setup
        try {
          const packageJsonExists = await instance.fs.readFile(
            "/package.json",
            "utf-8"
          );

          if (packageJsonExists) {
            // Already setup, just listen for server
            console.log("WebContainer already setup, waiting for server...");
            
            instance.on("server-ready", (port: number, url: string) => {
              console.log(`Server ready on ${url}`);
              setPreviewUrl(url);
              setLoadingState((prev) => ({
                ...prev,
                starting: false,
                ready: true,
              }));
              setIsSetupComplete(true);
              setIsSetupInProgress(false);
            });

            setCurrentStep(4);
            setLoadingState((prev) => ({
              ...prev,
              starting: true,
            }));
            return;
          }
        } catch (error) {
          // File doesn't exist, proceed with setup
          console.log("No existing setup found, proceeding with initial setup...");
        }

        //step 1: transform template data
        setCurrentStep(1);
        setLoadingState((prev) => ({ ...prev, transforming: true }));

        //todo terminal logic here
        console.log("Transforming template data...");

        //@ts-ignore
        const files = transformToWebContainerFormat(templateData);
        console.log("Files transformed:", Object.keys(files));
        
        setLoadingState((prev) => ({
          ...prev,
          transforming: false,
          mounting: true,
        }));
        setCurrentStep(2);

        //step 2: mount files

        //todo terminal logic here
        console.log("Mounting files...");
        await instance.mount(files);
        console.log("Files mounted successfully");

        //todo terminal logic

        setLoadingState((prev) => ({
          ...prev,
          mounting: false,
          installing: true,
        }));
        setCurrentStep(3);

        //step 3: install dependencies

        //todo terminal logic here
        console.log("Installing dependencies...");
        const installProcess = await instance.spawn("npm", ["install"]);

        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
                //todo terminal logic here
                console.log(data);
            },
          })
        );

        const installResult = await installProcess.exit;

        if (installResult !== 0) {
          throw new Error(`Dependency installation failed with code ${installResult}`);
        }
        console.log("Dependencies installed successfully");
        //todo terminal logic here


        setLoadingState((prev) => ({
          ...prev,
          installing: false,
          starting: true,
        }));
        setCurrentStep(4);

        //step 4: start the server
        console.log("Starting development server...");
        
        // Check package.json for available scripts
        const packageJson = await instance.fs.readFile("/package.json", "utf-8");
        const packageData = JSON.parse(packageJson);
        console.log("Available scripts:", packageData.scripts);
        
        // Determine which command to use
        let startCommand = "dev";
        if (packageData.scripts?.dev) {
          startCommand = "dev";
        } else if (packageData.scripts?.start) {
          startCommand = "start";
        } else {
          throw new Error("No dev or start script found in package.json");
        }
        
        console.log(`Using command: npm run ${startCommand}`);

        //todo terminal logic here  
        const startprocess = await instance.spawn("npm", ["run", startCommand]);
        
        let serverReadyTimeout: NodeJS.Timeout | null = null;
        
        // Set up server-ready listener
        const serverReadyHandler = (port: number, url: string) => {
            //todo terminal logic here
            console.log(`Server ready on port ${port}: ${url}`);
            if (serverReadyTimeout) {
              clearTimeout(serverReadyTimeout);
            }
            setPreviewUrl(url);
            setLoadingState((prev) => ({
              ...prev,
              starting: false,
              ready: true,
            }));
            setIsSetupComplete(true);
            setIsSetupInProgress(false);
        };
        
        instance.on("server-ready", serverReadyHandler);
        
        // Add timeout as fallback (30 seconds)
        serverReadyTimeout = setTimeout(() => {
          console.warn("Server ready event not received after 30s, checking manually...");
          // Try common ports
          const commonPorts = [3000, 5173, 8080, 4200, 5000];
          commonPorts.forEach(port => {
            const testUrl = `http://localhost:${port}`;
            console.log(`Attempting to use: ${testUrl}`);
            // For now, just use the first common port
            setPreviewUrl(testUrl);
            setLoadingState((prev) => ({
              ...prev,
              starting: false,
              ready: true,
            }));
            setIsSetupComplete(true);
            setIsSetupInProgress(false);
          });
        }, 30000);

        startprocess.output.pipeTo(
          new WritableStream({
            write(data) {
                //todo terminal logic here
                const output = data.toString();
                console.log(output);
                
                // Try to detect server URL from output
                const urlMatch = output.match(/https?:\/\/[^\s]+/);
                if (urlMatch) {
                  console.log("Detected URL in output:", urlMatch[0]);
                }
            },
          })
        );

      } catch (error) {
        console.error("Setup error:", error);
        const errormessage = error instanceof Error ? error.message : String(error);

        //todo terminal logic here

        setSetupError(errormessage);
        setIsSetupInProgress(false);
        setLoadingState({
          transforming: false,
          mounting: false,
          installing: false,
          starting: false,
          ready: false,
        });
       }
    }

    setupWebContainer();
  }, [instance, templateData, isSetupComplete, isSetupInProgress]);




  useEffect(() => {
    return()=>{

    }

  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h3 className="text-lg font-medium">Initializing WebContainer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Setting up the environment for your project...
          </p>
        </div>
      </div>
    );
  }

  if (error || setupError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error</h3>
          </div>
          <p className="text-sm">{error || setupError}</p>
        </div>
      </div>
    );
  }


  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

 const getStepText = (stepIndex: number, label: string) => {
    const isActive = stepIndex === currentStep;
    const isComplete = stepIndex < currentStep;
    
    return (
      <span className={`text-sm font-medium ${
        isComplete ? 'text-green-600' : 
        isActive ? 'text-blue-600' : 
        'text-gray-500'
      }`}>
        {label}
      </span>
    );
  };



  return ( <div className="h-full w-full flex flex-col">
      {!previewUrl ? (
        <div className="h-full flex flex-col">
          <div className="w-full max-w-md p-6 m-5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm mx-auto">
           

            <Progress
              value={(currentStep / totalSteps) * 100}
              className="h-2 mb-6"
            />

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                {getStepIcon(1)}
                {getStepText(1, "Transforming template data")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(2)}
                {getStepText(2, "Mounting files")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(3)}
                {getStepText(3, "Installing dependencies")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(4)}
                {getStepText(4, "Starting development server")}
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="flex-1 p-4">
            {/* <TerminalComponent 
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            /> */}
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Preview */}
          <div className="flex-1">
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="WebContainer Preview"
            />
          </div>
          
          {/* Terminal at bottom when preview is ready */}
          <div className="h-64 border-t">
            {/* <TerminalComponent 
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;
