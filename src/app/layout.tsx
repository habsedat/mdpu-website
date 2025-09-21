import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

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
  description: "The official website of the Mathamba Descendants Progressive Union, fostering unity, development, and community engagement among descendants of Mathamba.",
  icons: {
    icon: [
      { url: '/assets/leadership/mdpu logo4.jpg', sizes: 'any' },
      { url: '/assets/leadership/mdpu logo4.jpg', sizes: '16x16', type: 'image/jpeg' },
      { url: '/assets/leadership/mdpu logo4.jpg', sizes: '32x32', type: 'image/jpeg' }
    ],
    apple: [
      { url: '/assets/leadership/mdpu logo4.jpg', sizes: '180x180', type: 'image/jpeg' }
    ],
    other: [
      { url: '/assets/leadership/mdpu logo4.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/assets/leadership/mdpu logo4.jpg', sizes: '512x512', type: 'image/jpeg' }
    ]
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/leadership/mdpu logo4.jpg" sizes="any" />
        <link rel="icon" href="/assets/leadership/mdpu logo4.jpg" sizes="16x16" type="image/jpeg" />
        <link rel="icon" href="/assets/leadership/mdpu logo4.jpg" sizes="32x32" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/assets/leadership/mdpu logo4.jpg" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SiteHeader />
          <main>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
