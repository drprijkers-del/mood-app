import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "The Lab | Pink Pollos",
  description: "Tools for teams that build - Pulse & Delta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased bg-stone-50 text-stone-900`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
