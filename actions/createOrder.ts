"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { Address } from "@/sanity.types";
import { CartItem } from "@/store/cart";

interface GuestAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface OrderMetadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string;
  address?: Address | GuestAddress | null;
  email: string;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createOrder(
  items: GroupedCartItems[],
  metadata: OrderMetadata
) {
  try {
    // Create Sanity product references and prepare stock updates
    const sanityProducts = [];
    const stockUpdates = [];
    
    for (const item of items) {
      const productId = item.product._id;
      const quantity = item.quantity || 0;

      if (!productId) continue;

      sanityProducts.push({
        _key: crypto.randomUUID(),
        product: {
          _type: "reference",
          _ref: productId,
        },
        quantity,
      });
      stockUpdates.push({ productId, quantity });
    }

    // Create order in Sanity
    const order = await backendClient.create({
      _type: "order",
      orderNumber: metadata.orderNumber,
      customerName: metadata.customerName,
      email: metadata.customerEmail,
      clerkUserId: metadata.clerkUserId,
      products: sanityProducts,
      totalPrice: items.reduce((total, item) => total + ((item.product.salePrice || item.product.regularPrice || 0) * item.quantity), 0),
      currency: "BDT",
      amountDiscount: 0,
      status: "pending",
      orderDate: new Date().toISOString(),
      address: metadata.address
        ? {
            state: metadata.address.state,
            zip: metadata.address.zip,
            city: metadata.address.city,
            address: metadata.address.address,
            name: metadata.address.name,
          }
        : null,
    });

    // Update stock levels in Sanity
    await updateStockLevels(stockUpdates);
    
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

async function updateStockLevels(stockUpdates: { productId: string; quantity: number }[]) {
  for (const update of stockUpdates) {
    const product = await backendClient.getDocument(update.productId);
    if (product && typeof product.stock === 'number') {
      await backendClient
        .patch(update.productId)
        .set({ stock: product.stock - update.quantity })
        .commit();
    }
  }
} 