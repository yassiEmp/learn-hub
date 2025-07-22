# 📂 Image Upload & OCR Integration Plan for Course Generation (No Persistence)

## ✅ Overview
This document outlines the updated architecture and process for integrating image upload (with client-side compression and OCR) into the course generation system, without persistent storage. Images are processed in-memory, and their extracted text is merged with user input to generate courses.

---

## 🛠 Technology Stack
- **Frontend:**
  - Next.js (App Router)
  - Uppy (drag-and-drop UI, progress, multiple uploads)
  - browser-image-compression (client-side compression)
- **Backend:**
  - Next.js API route for course creation (handles image upload, OCR, and course generation)
  - Tesseract.js for OCR (in-memory)

---

## ✅ Flow Overview
### 1. User Interaction
- User selects/drags images and/or enters text in the course creation UI
- Client-side validation (type, size, max 50 images)
- Client-side compression (JPEG/WebP, ~60% quality, max 1024px width)
- Preview thumbnails and progress

### 2. Upload & Course Generation
- Client POSTs images and input text to `/api/course` (multipart/form-data)
- API route parses images in memory
- API calls internal OCR function (Tesseract.js) for each image
- API merges OCR text with input text
- API generates course using combined text
- API returns course data (and optionally, extracted text for preview)

---

## ✅ Key Considerations
- No persistent storage: images are discarded after OCR
- Vercel serverless timeouts (10s), memory limits (125MB)
- Limit batch size and compress images to avoid timeouts
- Validate files client- and server-side
- Privacy-friendly: no user images stored

---

## ✅ Suggested File/Component Structure
- `components/ImageUploader.tsx` (Uppy + compression)
- `pages/api/course/index.ts` (handles upload, OCR, merging, and course generation)
- `features/course/utils/ocr.ts` (Tesseract.js OCR helper)
- `features/course/utils/mergeExtractedContent.ts` (merge OCR + input text)
- Update course creation UI/backend to accept/process images and text

---

## ✅ Next Steps
1. Implement React + Uppy image upload component with compression
2. Update `/api/course` endpoint to accept images and text (multipart)
3. Add in-memory OCR processing (Tesseract.js)
4. Merge OCR text with user input for course generation
5. Update UI to preview/edit extracted text/images before final course creation

---

## ✅ References
- [Uppy](https://uppy.io/)
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)
- [Tesseract.js](https://github.com/naptha/tesseract.js) 