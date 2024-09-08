import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SSV DataLens",
  description: "Empower informed decision making through actionable insights!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Navbar /> {/* Navbar appears on every route */}
        <main>{children}</main> {/* Main content area */}
        <footer className="footer relative flex justify-center items-center p-4">
          <div className="absolute left-4 flex items-center font-['Trebuchet_MS',_sans-serif] ">
            <span className="mr-1">Made With</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="ml-1">By Cognivis & Team</span>
          </div>
          <p>Copyright © 2024, Created by DataLens</p>
        </footer>
      </body>
    </html>
  );
}