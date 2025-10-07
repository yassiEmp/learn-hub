import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "700"]
})

export const metadata: Metadata = {
  title: "flashmind",
  description: "flashmind is the ultimate AI-powered study and productivity app. Beyond reminders and focus tools, it helps you truly learn with interactive flashcards, fill-in-the-gap exercises, and personalized exam generation based on your study material. Whether you’re preparing for school exams, certifications, or self-learning, flashmind adapts to your needs. Beat procrastination, stay productive, and learn smarter with flashmind.",
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
