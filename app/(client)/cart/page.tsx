"use client";

import { useCartStore } from "@/store/cart";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createOrder, OrderMetadata } from "@/actions/createOrder";
import { Address } from "@/types/address";
import CartSidebar from "@/components/CartSidebar";

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export default function CartPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const { items, resetCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const groupedItems = useCartStore((state) => state.groupedItems);

  const handleGuestInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateGuestInfo = () => {
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "zip"];
    const missingFields = requiredFields.filter((field) => !guestInfo[field as keyof GuestInfo]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestInfo.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleCheckout = async () => {
    if (!groupedItems || Object.keys(groupedItems).length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isSignedIn && !validateGuestInfo()) {
      return;
    }

    setIsLoading(true);

    try {
      const orderMetadata: OrderMetadata = {
        customerName: isSignedIn ? user?.fullName || "" : guestInfo.name,
        email: isSignedIn ? user?.primaryEmailAddress?.emailAddress || "" : guestInfo.email,
        address: isSignedIn ? user?.publicMetadata?.address as Address : {
          name: guestInfo.name,
          address: guestInfo.address,
          city: guestInfo.city,
          state: guestInfo.state,
          zip: guestInfo.zip,
        },
      };

      const order = await createOrder(groupedItems, orderMetadata);
      
      if (order) {
        toast.success("Order placed successfully!");
        resetCart();
        router.push(`/order/${order.orderNumber}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
                    <Button
            onClick={() => router.push("/")}
            className="mt-4"
                    >
            Continue Shopping
                    </Button>
                  </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {Object.entries(groupedItems).map(([storeId, items]) => (
              <div key={storeId} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{items[0].product.store.name}</h2>
                      <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 relative">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="object-cover rounded-md"
                          />
                        </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.product.price} {item.product.currency} x {item.count}
                        </p>
                        </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {(item.product.price * item.count).toFixed(2)} {item.product.currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                                </div>
                              ))}
                      </div>

          <div className="lg:col-span-1">
            <CartSidebar />
            
            {!isSignedIn && (
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={guestInfo.name}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={guestInfo.email}
                      onChange={handleGuestInfoChange}
                      required
                    />
                </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={guestInfo.phone}
                      onChange={handleGuestInfoChange}
                      required
                    />
                      </div>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={guestInfo.address}
                      onChange={handleGuestInfoChange}
                      required
                        />
                      </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={guestInfo.city}
                        onChange={handleGuestInfoChange}
                        required
                        />
                      </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={guestInfo.state}
                        onChange={handleGuestInfoChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={guestInfo.zip}
                      onChange={handleGuestInfoChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? "Processing..." : "Place Order (Cash on Delivery)"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
