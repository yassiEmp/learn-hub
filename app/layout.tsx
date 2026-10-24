import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "700"]
})

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const siteTitle = "FlashMind — AI course generator: turn notes, PDFs & videos into courses and quizzes";
const siteDescription =
  "Paste notes, upload a PDF, drop a URL or YouTube link, record audio, or type a topic. FlashMind's AI builds a structured course with bite-sized lessons, then an exam that shows what to review. Free to start.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | FlashMind",
  },
  description: siteDescription,
  applicationName: "FlashMind",
  keywords: [
    "AI course generator",
    "turn PDF into quiz",
    "PDF to quiz",
    "study tool",
    "AI study tool",
    "notes to quiz",
    "YouTube to course",
    "AI quiz generator",
    "exam prep",
    "learn faster",
  ],
  openGraph: {
    type: "website",
    siteName: "FlashMind",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.className} antialiased w-full h-full overflow-x-hidden`}
      >
        <SpeedInsights />
        <Analytics />
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
