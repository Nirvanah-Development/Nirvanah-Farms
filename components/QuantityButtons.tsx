import { Product } from "@/sanity.types";
import { useCartStore } from "@/store/cart";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}
const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, updateQuantity, items } = useCartStore();
  const itemCount = items.find(item => item.product._id === product?._id)?.quantity || 0;

  const handleRemoveProduct = () => {
    if (!product?._id) {
      toast.error("Invalid product");
      return;
    }

    if (itemCount > 1) {
      updateQuantity(product._id, itemCount - 1);
      toast.success("Quantity Decreased successfully!");
    } else if (itemCount === 1) {
      updateQuantity(product._id, 0);
      toast.success(`${product?.name?.substring(0, 12)} removed successfully!`);
    }
  };

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
    toast.success("Quantity Increased successfully!");
  };

  return (
    <div className={cn("flex items-center gap-0.5 sm:gap-1 text-base max-w-full", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || !product?._id}
        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-[1px] hover:bg-shop_dark_green/20 transition-colors rounded-md flex-shrink-0 p-0"
      >
        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </Button>
      
      <span className="font-semibold text-xs sm:text-sm w-6 sm:w-8 text-center text-darkColor flex-shrink-0">
        {itemCount}
      </span>
      
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={!product?._id}
        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-[1px] hover:bg-shop_dark_green/20 transition-colors rounded-md flex-shrink-0 p-0"
      >
        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </Button>
    </div>
  );
};

export default QuantityButtons;
