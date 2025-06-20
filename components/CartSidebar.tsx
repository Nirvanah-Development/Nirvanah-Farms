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
import { useCartStore } from "@/store/cart";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";

export default function CartSidebar() {
  const { isCartOpen, closeCart } = useCart();
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => {
      if (!item || !item.product) {
        return sum;
      }
      
      const regularPrice = item.product.regularPrice || 0;
      const salePrice = item.product.salePrice || 0;
      const price = item.product.status === 'sale' ? salePrice : regularPrice;
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    },
    0
  );

  const discount = 0; // Discount will be applied at checkout
  const total = subtotal - discount;

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent
        side="right"
        className="flex flex-col h-full p-0 w-full max-w-[90vw] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[500px]"
      >
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Your cart is empty.
            </div>
          ) : (
            items.filter(item => item && item.product).map((item) => {
              // Use the correct image handling logic for Product type
              const imageUrl =
                item.product.images && item.product.images[0]
                  ? typeof item.product.images[0] === "string"
                    ? item.product.images[0]
                    : item.product.images[0].asset
                      ? urlFor(item.product.images[0]).url()
                      : "https://via.placeholder.com/80x80?text=No+Image"
                  : "https://via.placeholder.com/80x80?text=No+Image";
              
              const regularPrice = item.product.regularPrice || 0;
              const salePrice = item.product.salePrice || 0;
              const price = item.product.status === 'sale' ? salePrice : regularPrice;
              const quantity = item.quantity || 0;
              
              return (
                <div key={item.product._id} className="flex items-start gap-4 mb-6">
                  <div>
                    <Image
                      src={imageUrl}
                      alt={item.product.name || "Product"}
                      width={80}
                      height={80}
                      className="rounded border object-cover w-20 h-20"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-base">
                      {item.product.name || "Unnamed Product"}
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <div className="font-bold text-green-600 text-lg whitespace-nowrap">
                        Tk {(price * quantity).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product._id, Math.max(0, quantity - 1))}
                          >
                            -
                          </Button>
                          <span>{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product._id, quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product._id)}
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>
                Tk {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>
                Tk {discount.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-semibold text-lg">
              <span>Total</span>
              <span>
                Tk {total.toFixed(2)}
              </span>
            </div>
            <Button 
              className="w-full bg-shop_light_green text-white font-semibold rounded-md"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Order Cash on Delivery
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
