"use client";

import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import FavoriteButton from "./FavoriteButton";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { Logs, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCartStore } from "@/store/cart";
import { Button } from "./ui/button";

const Header = () => {
  const { openCart } = useCart();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 py-5 bg-white/70 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>
          <FavoriteButton />
          <Link
            href="/orders"
            className="group relative hover:text-shop_light_green hoverEffect"
          >
            <Logs />
          </Link>
        </div>
      </Container>
    </header>
  );
};

export default Header;
