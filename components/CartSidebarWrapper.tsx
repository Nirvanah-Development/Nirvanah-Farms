"use client";
import CartSidebar from "./CartSidebar";
import { useCartSidebar } from "./CartSidebarContext";

const CartSidebarWrapper = () => {
  const { open, setOpen } = useCartSidebar();
  return <CartSidebar open={open} onOpenChange={setOpen} />;
};

export default CartSidebarWrapper;
