import "./globals.css";
import { DrawerWrapper } from "@/shared/components/DrawerWrapper.component";
import { Toaster } from "@/shared/components/ui/toaster";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <DrawerWrapper>{children}</DrawerWrapper>
      <Toaster />
    </div>
  );
}
