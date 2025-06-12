"use client";
import { AlignLeft } from "lucide-react";
import React from "react";

interface MobileMenuProps {
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (open: boolean) => void;
}

const MobileMenu = ({ isSideMenuOpen, setIsSideMenuOpen }: MobileMenuProps) => {
  return (
    <button onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}>
      <AlignLeft className="hover:text-darkColor hoverEffect md:hidden hover:cursor-pointer" />
    </button>
  );
};

export default MobileMenu;
