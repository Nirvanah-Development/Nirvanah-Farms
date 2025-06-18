import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import MobileFooterNav from "@/components/MobileFooterNav";
export const metadata: Metadata = {
  title: {
    template: "%s - Nirvanah Farms",
    default: "Nirvanah Farms",
  },
  description: "Nirvanah Farms, Bringing the best quality mangoes from farms to your doorstep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <MobileFooterNav />
        <Footer />
      </div>
    </ClerkProvider>
  );
}
