import React, { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ImportTabs } from '@/features/content-import/components/ImportTabs';
import { ImportResult } from '@/features/content-import/utils/types';

const InputSection: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const { session } = useAuth();
    const router = useRouter();

    const handleContentImport = useCallback(async (result: ImportResult) => {
        setIsProcessing(true);
        
        try {
            const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
            const response = await fetch(`${base}/api/v1/course`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    text: result.content,
                    style: "chunk",
                    title: result.metadata.title || "default",
                    description: "default",
                    category: "default",
                    level: "default",
                    price: 0,
                    tags: ["default"],
                    importType: result.type,
                    importMetadata: result.metadata,
                    sourceFiles: result.blobUrl ? [{
                        url: result.blobUrl,
                        pathname: result.blobPathname,
                        type: result.type === 'document' ? 'document' : 'audio',
                        filename: result.metadata.source || 'unknown',
                        size: result.metadata.fileSize || 0,
                        uploadedAt: new Date().toISOString()
                    }] : [],
                    isPublic: false // Default to private, can be changed later
                })
            });
              
            const data = await response.json();
            console.log('Course creation response:', data);

            // Redirect to course page if id is present
            if (data?.data?.id) {
                router.push(`/course/${data.data.id}/detail`);
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Failed to create course. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    }, [session, router]);

    return (
        <ImportTabs 
            onContentImport={handleContentImport}
            isProcessing={isProcessing}
        />
    );
};

export default React.memo(InputSection);