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
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || !product?._id}
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Minus />
      </Button>
      <span className="font-semibold text-sm w-6 text-center text-darkColor">
        {itemCount}
      </span>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={!product?._id}
        className="w-6 h-6 border-[1px] hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
