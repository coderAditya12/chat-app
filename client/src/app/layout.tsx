import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/AuthGuard";
import ConditionalLayout from "@/components/ConditionlLayout";
import ThemeWrapper from "@/components/Themewrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatLingo — Language Exchange Chat",
  description: "Connect with language partners, chat in real-time, and practice languages together. Find your perfect exchange buddy on ChatLingo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeWrapper>
          {/* 🔥 SOLUTION: Move AuthGuard to wrap everything */}
          <AuthGuard>
            {/* ConditionalLayout (navbar/sidebar) is now INSIDE AuthGuard */}
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthGuard>
          <Toaster />
        </ThemeWrapper>
      </body>
    </html>
  );
}
