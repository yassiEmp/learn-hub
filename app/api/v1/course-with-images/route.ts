import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import Tesseract from "tesseract.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Parse form data with formidable
    const form = new formidable.IncomingForm({ multiples: true });
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Get images
    const uploadedImages = Array.isArray(files.images) ? files.images : files.images ? [files.images] : [];

    if (uploadedImages.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    // OCR with Tesseract.js
    let ocrText = "";
    for (const image of uploadedImages) {
      const result = await Tesseract.recognize(image.filepath, "eng");
      ocrText += result.data.text + "\n";
    }

    // Combine OCR text with text field
    const combinedText = `${fields.text || ""}\n${ocrText}`.trim();

    // Prepare course data
    const courseData = {
      text: combinedText,
      style: fields.style || "premium",
      title: fields.title || "default",
      description: fields.description || "default",
      category: fields.category || "default",
      level: fields.level || "default",
      price: Number(fields.price) || 0,
      tags: fields.tags ? JSON.parse(fields.tags as string) : ["default"],
    };

    // Forward to /api/v1/course
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const apiResponse = await fetch(`${baseUrl}/api/v1/course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify(courseData),
    });

    const data = await apiResponse.json();

    return NextResponse.json(data, { status: apiResponse.status });
  } catch (error) {
    console.error("Error in /course-with-images:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
