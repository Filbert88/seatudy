import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Seatudy - Learn and Grow Online",
  description:
    "Seatudy is a cutting-edge online learning platform designed to empower individuals to acquire new skills and achieve their professional goals.",
  generator: "Next.js",
  keywords: ["Learning Platform", "Learning", "Seatudy"],
  category: "Education",
  metadataBase: new URL("https://seatudy-real.vercel.app/"),
  applicationName: "Seatudy",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    ...openGraphTemplate,
    title: "Seatudy - Learn and Grow Online",
  },
  twitter: {
    ...twitterTemplate,
    title: "Seatudy - Learn and Grow Online",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
