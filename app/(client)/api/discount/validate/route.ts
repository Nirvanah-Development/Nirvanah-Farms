import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

interface CartItem {
  product: {
    _id: string;
    name?: string;
    regularPrice?: number;
    salePrice?: number;
    status?: string;
  };
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { code, cartItems } = await request.json();

    if (!code || !cartItems) {
      return NextResponse.json(
        { error: "Discount code and cart items are required" },
        { status: 400 }
      );
    }

    // Fetch discount code from Sanity (case sensitive exact match)
    const discountCode = await client.fetch(
      `*[_type == "discountCode" && code == $code && isActive == true][0]{
        _id,
        code,
        name,
        percentageOff,
        maxUsageCount,
        currentUsageCount,
        startDate,
        endDate,
        applicableProducts[]->{
          _id,
          name
        }
      }`,
      { code }
    );

    if (!discountCode) {
      return NextResponse.json(
        { error: "Code not valid" },
        { status: 400 }
      );
    }

    // Check if code has reached maximum usage
    if (discountCode.currentUsageCount >= discountCode.maxUsageCount) {
      return NextResponse.json(
        { error: "This discount code has been fully used" },
        { status: 400 }
      );
    }

    // Check date validity
    const now = new Date();
    const startDate = new Date(discountCode.startDate);
    const endDate = new Date(discountCode.endDate);

    if (now < startDate) {
      return NextResponse.json(
        { error: "This discount code is not yet active" },
        { status: 400 }
      );
    }

    if (now > endDate) {
      return NextResponse.json(
        { error: "This discount code has expired" },
        { status: 400 }
      );
    }

    // Check product restrictions
    let applicableItems: CartItem[] = cartItems;
    
    if (discountCode.applicableProducts && discountCode.applicableProducts.length > 0) {
      const applicableProductIds = discountCode.applicableProducts.map((p: { _id: string }) => p._id);
      applicableItems = cartItems.filter((item: CartItem) => 
        applicableProductIds.includes(item.product._id)
      );

      if (applicableItems.length === 0) {
        return NextResponse.json(
          { error: "This discount code is not applicable to any items in your cart" },
          { status: 400 }
        );
      }
    }

    // Calculate discount amount (apply discount to subtotal only, not shipping)
    const applicableSubtotal = applicableItems.reduce((sum: number, item: CartItem) => {
      const price = item.product.status === 'sale' 
        ? (item.product.salePrice || 0)
        : (item.product.regularPrice || 0);
      return sum + (price * item.quantity);
    }, 0);

    const discountAmount = (applicableSubtotal * discountCode.percentageOff) / 100;

    return NextResponse.json({
      success: true,
      discountCode: {
        _id: discountCode._id,
        code: discountCode.code,
        name: discountCode.name,
        percentageOff: discountCode.percentageOff,
      },
      discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
      applicableItems: applicableItems.length,
      totalItems: cartItems.length,
    });

  } catch (error) {
    console.error("Discount validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate discount code" },
      { status: 500 }
    );
  }
} 