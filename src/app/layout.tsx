import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/ui/custom/SkipLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MDPU - Mathamba Descendants Progressive Union",
  description: "Building stronger communities through togetherness and unity. Join the Mathamba Descendants Progressive Union.",
  keywords: ["MDPU", "Mathamba", "Progressive Union", "Sierra Leone", "Community", "Togetherness"],
  authors: [{ name: "MDPU" }],
  openGraph: {
    title: "MDPU - Mathamba Descendants Progressive Union",
    description: "Building stronger communities through togetherness and unity.",
    type: "website",
  },
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
        <SkipLink />
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
