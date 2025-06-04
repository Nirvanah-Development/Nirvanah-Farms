"use client";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Image from "next/image";
import useStore from "@/store";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { cn } from "@/lib/utils";

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ open, onOpenChange }) => {
  const { getGroupedItems, getTotalPrice, getItemCount, deleteCartProduct } =
    useStore();
  const groupedItems = getGroupedItems();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "flex flex-col h-full p-0",
          "w-full max-w-[90vw] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[500px]"
        )}
      >
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6">
          {groupedItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Your cart is empty.
            </div>
          ) : (
            groupedItems.map(({ product }) => {
              const itemCount = getItemCount(product._id);
              // Use your urlFor function to get the image URL
              const imageUrl =
                product.images && product.images[0]
                  ? typeof product.images[0] === "string"
                    ? product.images[0]
                    : product.images[0].asset
                      ? require("@/sanity/lib/image")
                          .urlFor(product.images[0])
                          .url()
                      : "/placeholder.png"
                  : "/placeholder.png";
              return (
                <div key={product._id} className="flex items-start gap-4 mb-6">
                  <div>
                    <Image
                      src={imageUrl}
                      alt={product.name || "Product"}
                      width={80}
                      height={80}
                      className="rounded border object-cover w-20 h-20"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-base">
                      {product.name}
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <div className="font-bold text-green-600 text-lg whitespace-nowrap">
                        <PriceFormatter
                          amount={(product.regularPrice || 0) * itemCount}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <QuantityButtons product={product} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteCartProduct(product._id)}
                          className="text-gray-400 hover:text-red-600"
                          aria-label="Remove"
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="p-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-lg">Subtotal</span>
            <span className="font-bold text-lg">
              <PriceFormatter amount={getTotalPrice()} />
            </span>
          </div>
          <Button className="w-full bg-shop_dark_green text-white font-semibold rounded-md">
            Order Cash on Delivery
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
