'use client';

import React from 'react';
import { Dashboard } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import Uppy from '@uppy/core';

interface ImageUploadDashboardProps {
  uppy: Uppy;
}

export const ImageUploadDashboard: React.FC<ImageUploadDashboardProps> = ({ uppy }) => {

  return (
    <div className="mt-4 flex items-center flex-col">
      <label className="block text-white mb-2">Upload Images</label>
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        hideUploadButton={false}
        height={320}
        theme="dark"
        note="Images will be compressed and uploaded via Tus."
      />
    </div>
  );
};
