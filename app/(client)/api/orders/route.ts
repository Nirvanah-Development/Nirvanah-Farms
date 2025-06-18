import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/sanity/lib/client";

interface ProductItem {
  _key?: string;
  product: {
    _ref: string;
    _type: string;
  };
  quantity: number;
  priceAtTime: number;
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields
    const requiredFields = [
      'orderNumber', 'customerName', 'phoneNumber', 'email', 
      'district', 'thana', 'shippingMethod', 'products', 'totalPrice'
    ];

    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Ensure all products have _key properties
    const productsWithKeys = orderData.products.map((product: ProductItem) => ({
      ...product,
      _key: product._key || crypto.randomUUID()
    }));

    // Create the order document in Sanity using write client
    const result = await writeClient.create({
      _type: "order",
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      phoneNumber: orderData.phoneNumber,
      alternativePhone: orderData.alternativePhone || "",
      email: orderData.email,
      officeCode: orderData.officeCode || "",
      district: orderData.district,
      thana: orderData.thana,
      shippingMethod: orderData.shippingMethod,
      shippingCost: orderData.shippingCost,
      paymentMethod: orderData.paymentMethod,
      products: productsWithKeys,
      subtotal: orderData.subtotal,
      discountAmount: orderData.discountAmount || 0,
      discountCode: orderData.discountCode,
      discountCodeId: orderData.discountCodeId,
      totalPrice: orderData.totalPrice,
      currency: orderData.currency || "BDT",
      address: orderData.address,
      status: orderData.status || "pending",
      orderDate: orderData.orderDate,
      notes: orderData.notes || "",
    });

    // Send order confirmation email asynchronously
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000');
      
      console.log('🔗 Using baseUrl for email API:', baseUrl);
      
      const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderNumber: result.orderNumber }),
      });

      if (emailResponse.ok) {
        console.log('Order confirmation email sent successfully');
      } else {
        console.error('Failed to send order confirmation email');
      }
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: result._id,
      orderNumber: result.orderNumber,
      message: "Order created successfully",
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    if (orderNumber) {
      // Get specific order by order number
      const order = await client.fetch(
        `*[_type == "order" && orderNumber == $orderNumber][0]{
          _id,
          orderNumber,
          customerName,
          email,
          phoneNumber,
          totalPrice,
          currency,
          status,
          orderDate,
          products[]{
            quantity,
            priceAtTime,
            product->{
              _id,
              name,
              images,
              regularPrice,
              salePrice,
              status
            }
          },
          address,
          shippingMethod,
          shippingCost,
          paymentMethod
        }`,
        { orderNumber }
      );

      if (!order) {
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(order);
    }

    // Get all orders (for admin purposes)
    const orders = await client.fetch(`
      *[_type == "order"] | order(orderDate desc){
        _id,
        orderNumber,
        customerName,
        email,
        totalPrice,
        currency,
        status,
        orderDate,
        paymentMethod
      }
    `);

    return NextResponse.json(orders);

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
} 