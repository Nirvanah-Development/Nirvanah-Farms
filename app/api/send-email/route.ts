import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationEmail, sendOrderConfirmationEmailFallback } from "@/lib/email";
import { client } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const { orderNumber } = await request.json();

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required" },
        { status: 400 }
      );
    }

    // Fetch the complete order details from Sanity
    const order = await client.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]{
        _id,
        orderNumber,
        customerName,
        email,
        phoneNumber,
        alternativePhone,
        district,
        thana,
        shippingMethod,
        shippingCost,
        paymentMethod,
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
        subtotal,
        discountAmount,
        discountCode,
        totalPrice,
        currency,
        address,
        status,
        orderDate,
        notes
      }`,
      { orderNumber }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (!order.email) {
      return NextResponse.json(
        { error: "No email address found for this order" },
        { status: 400 }
      );
    }

    const emailData = {
      order,
      customerEmail: order.email,
      customerName: order.customerName || "Valued Customer",
    };

    try {
      // Try sending with Resend first
      const result = await sendOrderConfirmationEmail(emailData);
      
      return NextResponse.json({
        success: true,
        message: "Order confirmation email sent successfully",
        emailId: result.emailId,
        service: "resend"
      });
      
    } catch (resendError) {
      console.error("Resend failed, trying fallback:", resendError);
      
      try {
        // Fallback to nodemailer
        await sendOrderConfirmationEmailFallback(emailData);
        
        return NextResponse.json({
          success: true,
          message: "Order confirmation email sent successfully (fallback)",
          service: "nodemailer"
        });
        
      } catch (fallbackError) {
        console.error("Both email services failed:", fallbackError);
        
        return NextResponse.json(
          { 
            error: "Failed to send email with all services",
            details: {
              resendError: resendError instanceof Error ? resendError.message : String(resendError),
              fallbackError: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
            }
          },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error("Error in send-email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 