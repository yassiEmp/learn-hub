"use client"
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUppyInstance } from '../hooks/useUppyInstance';
import { CourseTextarea } from './CourseTextarea';
import { ImageUploadDashboard } from './ImageUploadDashboard';
import { UploadControls } from './UploadControls';
import { useAuth } from '@/hooks/useAuth';

const InputWithImagesUpload: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const uppy = useUppyInstance();
  const { session } = useAuth();

  const handleSubmit = useCallback(
    async (e: React.FormEvent | React.MouseEvent) => {
      e.preventDefault();
      setUploading(true);
      const response = await fetch("http://localhost:3000/api/v1/course",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
            text: inputValue,
            // upload the image here as image: images_from_uppy
            // if possible make it with tus if not implement it  
            style: "premium",
            title: "default",
            description: "default",
            category: "default",
            level: "default",
            price: 0,
            tags: ["default"]
        })
    })
      
      // await uppy.upload(); // Upload images first
      setUploading(false);
      const data = await response.json()
      console.log(data)

    // Redirect to course page if id is present
    if (data?.data?.id) {
        router.push(`/course/${data.data.id}/detail`);
    }

    console.log('Course creation submitted:', inputValue);
    },
    [router,inputValue,session?.access_token]
  );

  return (
    <motion.form className="w-full px-4 sm:p-6 max-w-[90vw] mx-auto bg-black/40 p-6 rounded-2xl" onSubmit={handleSubmit}>
      <CourseTextarea value={inputValue} onChange={setInputValue} />
      {showImageUpload && <ImageUploadDashboard uppy={uppy}/>}
      <UploadControls
        onToggleImageUpload={() => setShowImageUpload((prev) => !prev)}
        onSubmit={handleSubmit}
        uploading={uploading}
      />
    </motion.form>
  );
};

export default InputWithImagesUpload;
