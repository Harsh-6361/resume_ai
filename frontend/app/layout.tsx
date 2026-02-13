import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ResumeProvider } from "@/context/ResumeContext";

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Resume Builder, Analyzer & Interview Coach",
  description: "Build ATS-optimized resumes, get AI-powered analysis with detailed scoring, and practice mock interviews with pronunciation and problem-solving evaluation. Free for students and job seekers.",
  keywords: "resume builder, ATS score, resume analyzer, mock interview, AI interview, career tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ResumeProvider>
          <Navbar />
          <main style={{ paddingTop: '64px' }}>
            {children}
          </main>
        </ResumeProvider>
      </body>
    </html>
  );
}
