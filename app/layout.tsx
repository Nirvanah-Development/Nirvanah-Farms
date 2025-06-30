import "./globals.css";
import "@/lib/fontawesome";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";
import { ClerkProvider } from "@clerk/nextjs";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className="font-poppins antialiased">
        <CartProvider>
          {children}
          <CartSidebar />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#000000",
                color: "#fff",
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
    </ClerkProvider>
  );
};
export default RootLayout;
