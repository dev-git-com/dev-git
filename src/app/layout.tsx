import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { DrawerWrapper } from "@/shared/components/DrawerWrapper.component";

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
      </body>
    </html>
  );
}