import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Toaster} from "react-hot-toast"
import ClientAuthLoader from "../components/ClientAuthLoader";



export const metadata: Metadata = {
  title: "HandiDraw",
  description: "HandiDraw is collaborative drawing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-black bg-[radial-gradient(circle,rgb(36,36,36)_0%,rgb(0,0,0)_100%)]`}
      >
        <ClientAuthLoader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
