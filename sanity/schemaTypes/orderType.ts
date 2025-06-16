import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alternativePhone",
      title: "Alternative Phone Number",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "officeCode",
      title: "Office Code",
      type: "string",
    }),
    defineField({
      name: "district",
      title: "District",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Dhaka City", value: "dhaka_city" },
          { title: "Chittagong", value: "chittagong" },
          { title: "Sylhet", value: "sylhet" },
          { title: "Rajshahi", value: "rajshahi" },
          { title: "Khulna", value: "khulna" },
          { title: "Barisal", value: "barisal" },
          { title: "Rangpur", value: "rangpur" },
          { title: "Mymensingh", value: "mymensingh" },
        ],
      },
    }),
    defineField({
      name: "thana",
      title: "Thana/Upazila",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          // Dhaka City thanas
          { title: "Dhanmondi", value: "dhanmondi" },
          { title: "Gulshan", value: "gulshan" },
          { title: "Banani", value: "banani" },
          { title: "Uttara", value: "uttara" },
          { title: "Mirpur", value: "mirpur" },
          { title: "Tejgaon", value: "tejgaon" },
          { title: "Wari", value: "wari" },
          { title: "Old Dhaka", value: "old_dhaka" },
          // Add more thanas as needed
        ],
      },
    }),
    defineField({
      name: "shippingMethod",
      title: "Shipping Method",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Inside Dhaka (Tk 70.00)", value: "inside_dhaka" },
          { title: "Inside Chittagong (Tk 70.00)", value: "inside_chittagong" },
          { title: "Outside above cities (Tk 130.00)", value: "outside_cities" },
        ],
      },
    }),
    defineField({
      name: "shippingCost",
      title: "Shipping Cost",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Cash on Delivery", value: "cod" },
          { title: "Mobile Banking", value: "mobile_banking" },
          { title: "Bank Transfer", value: "bank_transfer" },
        ],
      },
      initialValue: "cod",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
            }),
            defineField({
              name: "priceAtTime",
              title: "Price at Time of Purchase",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.images",
              price: "priceAtTime",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `Tk ${(select.price * select.quantity).toFixed(2)}`,
                media: select.image?.[0],
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discountAmount",
      title: "Discount Amount",
      type: "number",
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: "discountCode",
      title: "Discount Code Used",
      type: "string",
    }),
    defineField({
      name: "discountCodeId",
      title: "Discount Code Reference",
      type: "reference",
      to: [{ type: "discountCode" }],
      description: "Reference to the discount code document",
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "BDT",
    }),
    defineField({
      name: "address",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({ 
          name: "fullAddress", 
          title: "Full Address", 
          type: "text",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ 
          name: "district", 
          title: "District", 
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ 
          name: "thana", 
          title: "Thana/Upazila", 
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ 
          name: "name", 
          title: "Recipient Name", 
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Out for Delivery", value: "out_for_delivery" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "orderDate",
      title: "Order Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "notes",
      title: "Order Notes",
      type: "text",
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      currency: "currency",
      orderId: "orderNumber",
      email: "email",
      status: "status",
      paymentMethod: "paymentMethod",
    },
    prepare(select) {
      const orderIdSnippet = `${select.orderId?.slice(0, 5)}...${select.orderId?.slice(-5)}`;
      return {
        title: `${select.name} (${orderIdSnippet})`,
        subtitle: `${select.amount} ${select.currency} • ${select.paymentMethod?.toUpperCase()} • ${select.status}`,
        media: BasketIcon,
      };
    },
  },
});
