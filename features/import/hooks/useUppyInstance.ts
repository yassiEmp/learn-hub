'use client';

import Uppy, { Meta, UppyFile, UploadResult } from '@uppy/core';
import Tus from '@uppy/tus';
import ImageCompressor from 'browser-image-compression';
import Instagram from '@uppy/instagram';
import Url from '@uppy/url';
import Facebook from '@uppy/facebook';
import { useMemo, useEffect } from 'react';

const MAX_IMAGES = 50;

export function useUppyInstance() {
  const uppy = useMemo(() => {
    const instance = new Uppy({
      restrictions: {
        maxNumberOfFiles: MAX_IMAGES,
        allowedFileTypes: ['image/*'],
      },
      autoProceed: false,
    });

    // Resumable uploads with Tus
    instance.use(Tus, { endpoint: '/api/upload' });

    // Compress images before upload
    instance.on('file-added', async (file: UppyFile<Meta, Record<string, never>>) => {
      try {
        const compressed = await ImageCompressor(file.data as File, {
          maxWidthOrHeight: 1024,
          initialQuality: 0.6,
          useWebWorker: true,
        });
        instance.setFileState(file.id, { data: compressed });
      } catch (error) {
        console.error('Compression error:', error);
      }
    });

    // Log results
    instance.on('complete', (result: UploadResult<Meta, Record<string, never>>) => {
      if (result.failed) {
        if (result.failed.length > 0) console.error('Upload failed:', result.failed.map(f => f.name));
      }
    });

    // Add remote providers (via Companion)
    const companionUrl = 'https://companion.uppy.io';
    instance.use(Instagram, { companionUrl });
    instance.use(Url, { companionUrl });
    instance.use(Facebook, { companionUrl });

    return instance;
  }, []);

  // Cleanup on unmount
  useEffect(() => () => uppy.destroy(), [uppy]);

  return uppy;
}
