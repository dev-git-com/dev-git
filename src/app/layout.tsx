import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { DrawerWrapper } from "@/shared/components/DrawerWrapper.component";
import { Toaster } from "@/shared/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DrawerWrapper>{children}</DrawerWrapper>
        <Toaster />
      </body>
    </html>
  );
}