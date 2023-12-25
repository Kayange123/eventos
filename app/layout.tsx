import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { siteConfig } from "@/config/site";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `% | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: "/favicon.ico",
      href: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.variable}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
