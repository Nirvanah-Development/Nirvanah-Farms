"use client";
import React, { createContext, useContext, useState } from "react";

const CartSidebarContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export const useCartSidebar = () => useContext(CartSidebarContext);

export const CartSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <CartSidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </CartSidebarContext.Provider>
  );
};
