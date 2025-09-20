import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project management tool",
  description: "Organize your tasks",
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
        <Header />

        <div className="flex h-screen">

          <aside className="w-50 bg-gray-100 border-r border-gray-300 p-4">
            <SideMenu />
          </aside>

          {/* Main Body */}
          <main className="flex-1 p-6  bg-white">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
