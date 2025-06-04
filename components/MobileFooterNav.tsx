"use client";
import Link from "next/link";
import { Home, ShoppingCart, User, Grid } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: <Home size={24} />,
  },
  {
    label: "Categories",
    href: "/shop",
    icon: <Grid size={24} />,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: <ShoppingCart size={24} />,
  },
  {
    label: "account",
    href: "#",
    icon: <User size={24} />,
  },
];

const MobileFooterNav = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 md:hidden"
      style={{
        backgroundImage: 'url(/images/greenback.jpg)',
        backgroundSize: '150%',
        backgroundPosition: 'center',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center text-white hover:text-shop_light_green transition-all"
          >
            {item.icon}
            <span className="text-xs mt-1 font-medium tracking-wide">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileFooterNav; 