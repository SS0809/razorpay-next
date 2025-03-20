import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Ensure correct import
import { metadata } from "../app/metedata"; // Import metadata from separate file
import React, { Suspense } from "react"; // Import Suspense

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Suspense fallback={<div className="h-screen flex justify-center items-center">Loading...</div>}>
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}