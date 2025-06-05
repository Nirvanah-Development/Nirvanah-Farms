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
    <div className="w-full h-12 flex items-center">
      {itemCount > 0 ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={subtotalAmount}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={!product?._id}
          className={cn(
            "w-full bg-shop_dark_green/80 text-lightBg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
            className
          )}
        >
          <ShoppingBag /> Add to Cart
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
