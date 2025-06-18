"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faShoppingCart, 
  faPhone, 
  faThLarge 
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/contexts/CartContext";
import { useCartStore } from "@/store/cart";

const MobileFooterNav = () => {
  const { openCart } = useCart();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    openCart();
  };

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <FontAwesomeIcon icon={faHome} size="lg" />,
    },
    {
      label: "Categories",
      href: "/shop",
      icon: <FontAwesomeIcon icon={faThLarge} size="lg" />,
    },
    {
      label: "Cart",
      icon: <FontAwesomeIcon icon={faShoppingCart} size="lg" />,
      isButton: true,
    },
    {
      label: "Contact",
      href: "/contact",
      icon: <FontAwesomeIcon icon={faPhone} size="lg" />,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 md:hidden"
      style={{
        backgroundImage: 'url(/images/greenback.jpg)',
        backgroundSize: '250%',
        backgroundPosition: 'left',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          if ('isButton' in item && item.isButton) {
            return (
              <button
                key={item.label}
                onClick={handleCartClick}
                className="flex flex-col items-center text-white hover:text-shop_light_green transition-all relative"
              >
                {item.icon}
                {itemCount > 0 && (
                  <span className="
                    absolute -top-1 -right-1 
                    flex h-4 w-4
                    items-center justify-center 
                    rounded-full 
                    bg-red-500 
                    text-white
                    text-[10px]
                    font-bold
                    border-2 border-white
                    shadow-sm
                    min-w-[16px]
                  ">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                <span className="text-xs mt-1 font-medium tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <Link
              key={item.label}
              href={item.href!}
              className="flex flex-col items-center text-white hover:text-shop_light_green transition-all"
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileFooterNav; 