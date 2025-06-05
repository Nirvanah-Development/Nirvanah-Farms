import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">
        <CartProvider>
          {children}
          <CartSidebar />
          <Toaster
            position="bottom-right"
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
  );
};
export default RootLayout;
