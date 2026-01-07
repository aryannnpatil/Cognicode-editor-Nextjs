"use client"
import { usePlayground } from '@/modules/playground/hooks/usePlayground';
import { useParams } from 'next/navigation'
import React from 'react'

const MainPlaygroundPage = () => {
    const { id } = useParams<{ id: string }>();
    const {playgroundData, templateData, isLoading, error, loadPlayground, saveTemplateData} = usePlayground(id);

    console.log("TEMPLATE DATA:", templateData);
    console.log("playground", playgroundData);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>Loading playground...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-red-600">
                    <h2 className="text-2xl font-bold mb-2">Error Loading Playground</h2>
                    <p>{error}</p>
                    <button 
                        onClick={loadPlayground}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>Playground: {playgroundData?.title || id}</h1>
            <p>Description: {playgroundData?.description}</p>
            <p>Template: {playgroundData?.template}</p>
            {templateData && (
                <div className="mt-4">
                    <h2>Template Data Loaded</h2>
                    <p>Folder: {templateData.folderName}</p>
                    <p>Items: {templateData.items?.length || 0}</p>
                </div>
            )}
        </div>
    );
}

export default MainPlaygroundPage
