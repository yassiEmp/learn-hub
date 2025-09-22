import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "700"]
})

export const metadata: Metadata = {
  title: "Master-It",
  description: "Master-it is the ultimate AI-powered study and productivity app. Beyond reminders and focus tools, it helps you truly learn with interactive flashcards, fill-in-the-gap exercises, and personalized exam generation based on your study material. Whether you’re preparing for school exams, certifications, or self-learning, Master-it adapts to your needs. Beat procrastination, stay productive, and learn smarter with Master-it.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
