import { Resend } from 'resend';
import { Order } from '@/sanity.types';
import nodemailer from 'nodemailer';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  order: Order;
  customerEmail: string;
  customerName: string;
}

function getShippingMethodLabel(shippingMethod?: string): string {
  switch (shippingMethod) {
    case 'inside_dhaka':
      return 'Inside Dhaka (Tk 70.00)';
    case 'inside_chittagong':
      return 'Inside Chittagong (Tk 70.00)';
    case 'outside_cities':
      return 'Outside above cities (Tk 130.00)';
    default:
      return 'Standard Shipping';
  }
}

export async function sendOrderConfirmationEmail(data: EmailData) {
  try {
    console.log('📧 Attempting to send email with Resend...');
    const { order, customerEmail, customerName } = data;
    
    // Calculate totals
    const itemCount = order.products?.length || 0;
    const formattedOrderDate = order.orderDate 
      ? new Date(order.orderDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    // Generate product list HTML
    const productListHtml = order.products?.map(product => {
      const productName = 'Product';
      const unitPrice = product.priceAtTime || 0;
      const quantity = product.quantity || 1;
      const totalPrice = unitPrice * quantity;
      
      return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <div style="font-weight: bold;">${productName}</div>
          <div style="color: #666; font-size: 12px;">Unit Price: ৳${unitPrice.toFixed(2)}</div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ৳${totalPrice.toFixed(2)}
        </td>
      </tr>`;
    }).join('') || '';

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #16a34a;">
        <h1 style="color: #16a34a; margin: 0; font-size: 28px;">🛍️ Thank You for Your Order!</h1>
        <p style="color: #666; margin: 10px 0 0 0;">আপনার অর্ডারের জন্য ধন্যবাদ!</p>
      </div>

      <!-- Customer Info -->
      <div style="padding: 20px 0;">
        <h2 style="color: #16a34a; border-bottom: 1px solid #eee; padding-bottom: 10px;">Dear ${customerName},</h2>
        <p>We're excited to confirm that we've received your order! Here are the details:</p>
      </div>

      <!-- Order Summary -->
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #16a34a;">Order Summary</h3>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span><strong>Order Number:</strong></span>
          <span style="color: #16a34a; font-weight: bold;">${order.orderNumber}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span><strong>Order Date:</strong></span>
          <span>${formattedOrderDate}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span><strong>Total Items:</strong></span>
          <span>${itemCount}</span>
        </div>
                 <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
           <span><strong>Payment Method:</strong></span>
           <span>${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
         </div>
         <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
           <span><strong>Shipping Method:</strong></span>
           <span>${getShippingMethodLabel(order.shippingMethod)}</span>
         </div>
      </div>

      <!-- Products Table -->
      <div style="margin: 20px 0;">
        <h3 style="color: #16a34a;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #16a34a; color: white;">
              <th style="padding: 12px; text-align: left;">Item</th>
              <th style="padding: 12px; text-align: center;">Quantity</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${productListHtml}
          </tbody>
        </table>
      </div>

      <!-- Pricing Details -->
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Subtotal:</span>
          <span>৳${(order.subtotal || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span>Shipping:</span>
          <span>৳${(order.shippingCost || 0).toFixed(2)}</span>
        </div>
        ${order.discountAmount && order.discountAmount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #dc2626;">
          <span>Discount:</span>
          <span>-৳${order.discountAmount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div style="border-top: 2px solid #16a34a; padding-top: 10px; margin-top: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #16a34a;">
            <span>Total:</span>
            <span>৳${(order.totalPrice || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Shipping Address -->
      ${order.address ? `
      <div style="margin: 20px 0;">
        <h3 style="color: #16a34a;">Shipping Address</h3>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
          <p style="margin: 0;"><strong>${order.address.name}</strong></p>
          <p style="margin: 5px 0;">${order.address.fullAddress}</p>
          <p style="margin: 5px 0;">${order.address.thana}, ${order.address.district}</p>
        </div>
      </div>
      ` : ''}

      <!-- Next Steps -->
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
        <h3 style="color: #16a34a; margin-top: 0;">What's Next?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>We'll process your order within 1-2 business days</li>
          <li>You'll receive a shipping confirmation with tracking details</li>
          <li>Your order will be delivered within 2-7 business days</li>
          <li>Payment will be collected upon delivery (Cash on Delivery)</li>
        </ul>
      </div>

      <!-- Contact Info -->
      <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; margin-top: 30px;">
        <h3 style="color: #16a34a;">Need Help?</h3>
        <p>If you have any questions about your order, feel free to contact us:</p>
        <p style="margin: 10px 0;">
          📞 Phone: +880-XXX-XXXXXX<br>
          📧 Email: support@yourstore.com<br>
          🕒 Support Hours: 9 AM - 6 PM (Sunday to Thursday)
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px 0; background-color: #f8f9fa; border-radius: 8px; margin-top: 20px;">
        <p style="margin: 0; color: #666;">Thank you for shopping with us! 🙏</p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">আমাদের সাথে কেনাকাটার জন্য ধন্যবাদ!</p>
      </div>

    </body>
    </html>
    `;

    // Send email using Resend
    const { data: emailResult, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Your Store <noreply@yourstore.com>',
      to: [customerEmail],
      subject: `Order Confirmation - ${order.orderNumber} | আপনার অর্ডার নিশ্চিত হয়েছে`,
      html: emailHtml,
    });

    if (error) {
      console.error('❌ Resend email failed:', error);
      throw new Error(`Resend failed: ${error.message}`);
    }

    console.log('✅ Resend email sent successfully:', emailResult);
    return { success: true, emailId: emailResult?.id };

  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error);
    throw error;
  }
}

// Fallback email service using nodemailer (in case Resend fails)
export async function sendOrderConfirmationEmailFallback(data: EmailData): Promise<{ success: boolean; messageId?: string }> {
  try {
    console.log('🔄 Attempting SMTP fallback email sending...');
    
    // Validate SMTP environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      const missingVars = [];
      if (!process.env.SMTP_USER) missingVars.push('SMTP_USER');
      if (!process.env.SMTP_PASS) missingVars.push('SMTP_PASS');
      
      console.error('❌ Missing SMTP environment variables:', missingVars);
      throw new Error(`Missing SMTP environment variables: ${missingVars.join(', ')}`);
    }

    console.log('✅ SMTP environment variables found');
    console.log('📧 SMTP Host:', process.env.SMTP_HOST || 'smtp.gmail.com');
    console.log('🔌 SMTP Port:', process.env.SMTP_PORT || '587');
    console.log('👤 SMTP User:', process.env.SMTP_USER);

    // Create transporter with enhanced configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
      },
      debug: true, // Enable debug mode
      logger: true, // Enable logging
    });

    console.log('🔧 SMTP transporter created');

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError: any) {
      console.error('❌ SMTP connection verification failed:', verifyError);
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }

    const { order, customerEmail, customerName } = data;

    // Plain text version for fallback
    const textContent = `
Dear ${customerName},

Thank you for your order! Here are the details:

Order Number: ${order.orderNumber}
Total Amount: ৳${(order.totalPrice || 0).toFixed(2)}
Payment Method: ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}

We'll process your order within 1-2 business days and you'll receive tracking information.

Best regards,
Your Store Team
    `;

    console.log('📬 Sending email to:', customerEmail);

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Your Store <noreply@yourstore.com>',
      to: customerEmail,
      subject: `Order Confirmation - ${order.orderNumber} | আপনার অর্ডার নিশ্চিত হয়েছে`,
      text: textContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Fallback email sent successfully:', result.messageId);
    
    return { success: true, messageId: result.messageId };
    
  } catch (error: any) {
    console.error('❌ Fallback email service failed:', error);
    
    // Provide more detailed error information
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed - check SMTP_USER and SMTP_PASS');
    } else if (error.code === 'ECONNECTION') {
      console.error('🔌 Connection failed - check SMTP_HOST and SMTP_PORT');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('⏱️ Connection timed out - check network connection');
    }
    
    throw new Error(`SMTP fallback failed: ${error.message}`);
  }
}