"use client";

import React, { useState } from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import MobileMenu from "./MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";
import { useCartStore } from "@/store/cart";
import { Button } from "./ui/button";
import SideMenu from "./SideMenu";
import { PurchaseModeToggle } from "./PurchaseModeToggle";

const Header = () => {
  const { openCart } = useCart();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 py-3 sm:py-4 lg:py-5 bg-white/70 backdrop-blur-md border-b border-gray-100/50">
      <Container className="flex items-center justify-between text-lightColor min-h-[44px]">
        {/* Left Section - Mobile Menu & Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 justify-start flex-shrink-0 min-w-0">
          <MobileMenu 
            isSideMenuOpen={isSideMenuOpen}
            setIsSideMenuOpen={setIsSideMenuOpen}
          />
          <Logo />
        </div>

        {/* Center Section - Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <HeaderMenu />
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 justify-end flex-shrink-0">
          {/* Purchase Mode Toggle */}
          <PurchaseModeToggle />

          {/* Shopping Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="
              relative 
              h-9 w-9 sm:h-10 sm:w-10 
              hover:bg-gray-100 
              transition-colors 
              duration-200
              flex-shrink-0
            "
            onClick={openCart}
          >
            <FontAwesomeIcon 
              icon={faShoppingCart} 
              className="h-4 w-4 sm:h-5 sm:w-5" 
            />
            {itemCount > 0 && (
              <span className="
                absolute -top-1 -right-1 
                flex h-4 w-4 sm:h-5 sm:w-5
                items-center justify-center 
                rounded-full 
                bg-shop_light_green 
                text-white
                text-[10px] sm:text-xs
                font-bold
                border-2 border-white
                shadow-sm
                min-w-[16px] sm:min-w-[20px]
              ">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Button>
        </div>
      </Container>

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
