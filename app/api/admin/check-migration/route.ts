import { NextResponse } from "next/server";
import { writeClient, client } from "@/sanity/lib/client";

interface ProductItem {
  _key?: string;
  product: {
    _ref: string;
    _type: string;
  };
  quantity: number;
  priceAtTime: number;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  products?: ProductItem[];
}

export async function POST() {
  try {
    // Fetch all orders with their products
    const orders: OrderData[] = await client.fetch(`
      *[_type == "order"] {
        _id,
        orderNumber,
        products[] {
          _key,
          product,
          quantity,
          priceAtTime
        }
      }
    `);

    const totalOrders = orders.length;
    let fixedOrders = 0;
    const errors: string[] = [];

    // Process each order
    for (const order of orders) {
      try {
        // Check if any products are missing _key
        const needsfix = order.products?.some((product: ProductItem) => !product._key);
        
        if (needsfix) {
          // Add _key to products that don't have it
          const fixedProducts = order.products?.map((product: ProductItem) => ({
            ...product,
            _key: product._key || crypto.randomUUID()
          })) || [];

          // Update the order in Sanity
          await writeClient
            .patch(order._id)
            .set({ products: fixedProducts })
            .commit();

          fixedOrders++;
          console.log(`Fixed order ${order.orderNumber} (${order._id})`);
        }
      } catch (error) {
        const errorMessage = `Failed to fix order ${order.orderNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    return NextResponse.json({
      total: totalOrders,
      fixed: fixedOrders,
      errors: errors
    });

  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { 
        error: "Failed to run migration",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 