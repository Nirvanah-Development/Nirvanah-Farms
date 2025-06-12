"use client";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import { useCart } from "@/contexts/CartContext";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, items } = useCartStore();
  const { openCart } = useCart();
  
  // Get item count from the cart store with proper null checking
  const itemCount = items.find(item => item.product._id === product?._id)?.quantity || 0;

  const handleAddToCart = () => {
    if (!product?._id) {
      toast.error("Invalid product");
      return;
    }

    // Use the full Product type directly
    const cartItem = {
      product: product,
      quantity: 1,
    };
    
    addItem(cartItem);
    openCart();
    toast.success(
      `${product?.name?.substring(0, 12)}... added successfully!`
    );
  };

  // Calculate price with null checks
  const regularPrice = product?.regularPrice || 0;
  const subtotalAmount = regularPrice * itemCount;

  return (
    <div className="w-full">
      {itemCount > 0 ? (
        <div className="text-sm w-full space-y-2 p-2 bg-gray-50 rounded-lg border">
          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80 font-medium">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          
          {/* Subtotal */}
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-xs font-semibold text-darkColor">Subtotal</span>
            <PriceFormatter
              amount={subtotalAmount}
              className="text-sm font-bold text-shop_dark_green"
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={!product?._id}
          className={cn(
            "w-full h-10 sm:h-11 bg-shop_dark_green/80 text-white shadow-none border border-shop_dark_green/80 font-semibold tracking-wide hover:bg-shop_dark_green hover:border-shop_dark_green transition-all duration-200 text-xs sm:text-sm rounded-lg",
            className
          )}
        >
          <ShoppingBag className="w-4 h-4 mr-1" />
          <span className="truncate">Add to Cart</span>
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
