import "server-only";
import { chatModelName, openRouterConfig, isOpenRouter } from "@/utils/ai/model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Result } from "@/utils/utils";

const EXT_MIME: Record<string, string> = {
  mp3: "audio/mp3",
  wav: "audio/wav",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  flac: "audio/flac",
  aac: "audio/aac",
  m4a: "audio/mp4",
  aiff: "audio/aiff",
  webm: "audio/webm",
  mp4: "video/mp4",
  mov: "video/quicktime",
  mpeg: "video/mpeg",
  mpg: "video/mpeg",
  avi: "video/x-msvideo",
  wmv: "video/x-ms-wmv",
  flv: "video/x-flv",
  "3gp": "video/3gpp",
  mkv: "video/webm",
};

/**
 * Work out the media type from the bytes first (browsers label MediaRecorder
 * output "audio/wav" even when it is webm), then from the file extension.
 */
export function detectMimeType(bytes: Buffer, fileName?: string, kind: "audio" | "video" = "audio"): string {
  const hex = bytes.subarray(0, 12).toString("hex");
  const ascii = bytes.subarray(0, 12).toString("latin1");
  if (hex.startsWith("1a45dfa3")) return kind === "video" ? "video/webm" : "audio/webm";
  if (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WAVE") return "audio/wav";
  if (ascii.startsWith("RIFF") && ascii.slice(8, 11) === "AVI") return "video/x-msvideo";
  if (ascii.startsWith("OggS")) return "audio/ogg";
  if (ascii.startsWith("fLaC")) return "audio/flac";
  if (ascii.startsWith("ID3") || hex.startsWith("fffb") || hex.startsWith("fff3") || hex.startsWith("fff2")) return "audio/mp3";
  if (ascii.startsWith("FORM") && ascii.slice(8, 12) === "AIFF") return "audio/aiff";
  if (ascii.slice(4, 8) === "ftyp") {
    const brand = ascii.slice(8, 12);
    if (brand.startsWith("M4A")) return "audio/mp4";
    if (brand.startsWith("qt")) return "video/quicktime";
    return kind === "video" ? "video/mp4" : "audio/mp4";
  }
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (ext && EXT_MIME[ext]) return EXT_MIME[ext];
  return kind === "video" ? "video/webm" : "audio/webm";
}

/** Transcribe audio or video bytes with Gemini (inline data). */
export async function transcribeMedia(bytes: Buffer, mimeType: string): Promise<Result<string>> {
  try {
    if (isOpenRouter()) return await transcribeViaOpenRouter(bytes, mimeType);

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return { err: new Error("GOOGLE_API_KEY is not set"), res: null };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: chatModelName() });

    const result = await model.generateContent([
      { inlineData: { data: bytes.toString("base64"), mimeType } },
      { text: TRANSCRIBE_PROMPT },
    ]);

    const text = result.response.text().trim();
    if (!text) return { err: new Error("No speech detected"), res: null };
    return { err: null, res: text };
  } catch (err) {
    console.error("transcribeMedia failed:", err);
    return { err, res: null };
  }
}

const TRANSCRIBE_PROMPT =
  "Transcribe verbatim. Output only the spoken words as plain text, in the original language, " +
  "with paragraph breaks where the speaker pauses or changes topic. Do not add commentary, " +
  "timestamps or speaker labels. If there is no intelligible speech, output nothing.";

/** OpenRouter chat completion with the media inline: input_audio for audio, a data URL for video. */
async function transcribeViaOpenRouter(bytes: Buffer, mimeType: string): Promise<Result<string>> {
  const data = bytes.toString("base64");
  const media = mimeType.startsWith("video/")
    ? { type: "video_url", video_url: { url: `data:${mimeType};base64,${data}` } }
    : { type: "input_audio", input_audio: { data, format: mimeType.split("/")[1]?.replace("mpeg", "mp3").replace("x-", "") || "wav" } };

  const { baseURL, defaultHeaders } = openRouterConfig();
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: chatModelName(),
      messages: [{ role: "user", content: [media, { type: "text", text: TRANSCRIBE_PROMPT }] }],
      temperature: 0,
    }),
  });
  if (!response.ok) {
    return { err: new Error(`OpenRouter ${response.status}: ${await response.text()}`), res: null };
  }
  const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) return { err: new Error("No speech detected"), res: null };
  return { err: null, res: text };
}
