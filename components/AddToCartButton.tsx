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
import { usePurchaseModeStore } from "@/store/purchaseMode";
import { useState } from "react";
import { Input } from "./ui/input";

interface Props {
  product: Product;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, items } = useCartStore();
  const { openCart } = useCart();
  const { purchaseMode } = usePurchaseModeStore();

  const [groupMembers, setGroupMembers] = useState(1);

  const itemCount = items.find(item => item.product._id === product?._id)?.quantity || 0;

  const handleAddToCart = () => {
    if (!product?._id) {
      toast.error("Invalid product");
      return;
    }
    const cartItem = {
      product: product,
      quantity: 1,
      groupMembers: purchaseMode === 'group' ? groupMembers : undefined,
    };
    
    addItem(cartItem);
    openCart();
    toast.success(
      `${product?.name?.substring(0, 12)}... added successfully!`
    );
  };

  const regularPrice = product?.regularPrice || 0;
  const subtotalAmount = regularPrice * itemCount;
  const perPersonCost = purchaseMode === 'group' && groupMembers > 0 ? regularPrice / groupMembers : regularPrice;

  if (purchaseMode === 'group') {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Purchasers</span>
          <Input
            type="number"
            min={2}
            value={groupMembers}
            onChange={(e) => setGroupMembers(Number(e.target.value))}
            className="w-20 h-8"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            পরিমাণ <span className="text-xs text-gray-500">(জনপ্রতি)</span>
          </span>
          <span className="text-sm font-bold text-shop_dark_green">
            {product.name?.includes('10') ? `${(10 / groupMembers).toFixed(2)}KG` : `${(20 / groupMembers).toFixed(2)}KG`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            খরচ <span className="text-xs text-gray-500">(জনপ্রতি)</span>
          </span>
          <PriceFormatter
            amount={perPersonCost}
            className="text-sm font-bold text-shop_dark_green"
          />
        </div>
        <div className="flex items-center justify-between border-t pt-2">
            <span className="text-sm font-semibold text-darkColor">Subtotal</span>
            <PriceFormatter
              amount={regularPrice}
              className="text-sm font-bold text-shop_dark_green"
            />
        </div>
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
      </div>
    )
  }

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
