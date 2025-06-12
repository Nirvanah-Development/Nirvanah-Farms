"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Phone, Truck } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { toast } from "sonner";

interface OrderFormData {
  customerName: string;
  phoneNumber: string;
  alternativePhone: string;
  email: string;
  officeCode: string;
  district: string;
  thana: string;
  fullAddress: string;
  shippingMethod: string;
  discountCode: string;
}

const districts = [
  { value: "dhaka_city", label: "Dhaka City" },
  { value: "chittagong", label: "Chittagong" },
  { value: "sylhet", label: "Sylhet" },
  { value: "rajshahi", label: "Rajshahi" },
  { value: "khulna", label: "Khulna" },
  { value: "barisal", label: "Barisal" },
  { value: "rangpur", label: "Rangpur" },
  { value: "mymensingh", label: "Mymensingh" },
];

const thanas = [
  { value: "dhanmondi", label: "Dhanmondi" },
  { value: "gulshan", label: "Gulshan" },
  { value: "banani", label: "Banani" },
  { value: "uttara", label: "Uttara" },
  { value: "mirpur", label: "Mirpur" },
  { value: "tejgaon", label: "Tejgaon" },
  { value: "wari", label: "Wari" },
  { value: "old_dhaka", label: "Old Dhaka" },
];

const shippingOptions = [
  { value: "inside_dhaka", label: "ঢাকা সিটির ভিতরে (Inside Dhaka)", cost: 70 },
  { value: "inside_chittagong", label: "চট্টগ্রাম সিটির ভিতরে (Inside Chittagong)", cost: 70 },
  { value: "outside_cities", label: "ঢাকা এবং চট্টগ্রাম সিটির বাহিরে (Outside above cities)", cost: 130 },
];

export default function CheckoutPage() {
  const { items, resetCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: "",
    phoneNumber: "",
    alternativePhone: "",
    email: "",
    officeCode: "",
    district: "",
    thana: "",
    fullAddress: "",
    shippingMethod: "inside_dhaka",
    discountCode: "",
  });

  const [errors, setErrors] = useState<Partial<OrderFormData>>({});

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const regularPrice = item.product.regularPrice || 0;
    const salePrice = item.product.salePrice || 0;
    const price = item.product.status === 'sale' ? salePrice : regularPrice;
    return sum + (price * item.quantity);
  }, 0);

  const shippingCost = shippingOptions.find(option => option.value === formData.shippingMethod)?.cost || 70;
  const discountAmount = 0; // Will implement discount logic later
  const total = subtotal + shippingCost - discountAmount;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.district) {
      newErrors.district = "District is required";
    }

    if (!formData.thana) {
      newErrors.thana = "Thana is required";
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderNumber = (): string => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderNumber: generateOrderNumber(),
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        alternativePhone: formData.alternativePhone,
        email: formData.email,
        officeCode: formData.officeCode,
        district: formData.district,
        thana: formData.thana,
        shippingMethod: formData.shippingMethod,
        shippingCost,
        paymentMethod: "cod",
        products: items.map(item => ({
          product: { _ref: item.product._id, _type: "reference" },
          quantity: item.quantity,
          priceAtTime: item.product.status === 'sale' 
            ? (item.product.salePrice || 0) 
            : (item.product.regularPrice || 0),
        })),
        subtotal,
        discountAmount,
        discountCode: formData.discountCode || null,
        totalPrice: total,
        currency: "BDT",
        address: {
          fullAddress: formData.fullAddress,
          district: formData.district,
          thana: formData.thana,
          name: formData.customerName,
        },
        status: "pending",
        orderDate: new Date().toISOString(),
        notes: "",
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      
      // Clear cart and redirect to success page
      resetCart();
      toast.success("অর্ডার সফলভাবে তৈরি হয়েছে! (Order created successfully!)");
      router.push(`/success?orderId=${result.orderNumber}`);
      
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("অর্ডার তৈরি করতে সমস্যা হয়েছে (Failed to create order)");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-green-600" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">
              অর্ডার সারাংশ / Order Summary
            </h1>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">
              ৳{total.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="text-green-600" size={20} />
                  গ্রাহকের তথ্য / Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Name */}
                  <div>
                    <Label htmlFor="customerName" className="text-base font-medium">
                      আপনার নাম/Your Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      type="text"
                      placeholder="আপনার নাম/Name"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      className={errors.customerName ? "border-red-500" : ""}
                    />
                    {errors.customerName && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <Label htmlFor="phoneNumber" className="text-base font-medium">
                      ফোন নম্বর/Phone number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="আপনার ফোন নম্বর/ Your phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className={errors.phoneNumber ? "border-red-500" : ""}
                    />
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Alternative Phone */}
                  <div>
                    <Label htmlFor="alternativePhone" className="text-base font-medium">
                      বিকল্প ফোন নম্বর/Alternative Phone number{" "}
                      <span className="text-sm text-gray-500">
                        (caretakers, guards, other family member)
                      </span>
                    </Label>
                    <Input
                      id="alternativePhone"
                      type="tel"
                      placeholder="আপনার ফোন নম্বর/ Your phone number"
                      value={formData.alternativePhone}
                      onChange={(e) => handleInputChange("alternativePhone", e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      ই-মেইল/email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="আপনার ই-মেইল / Your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Office Code */}
                  <div>
                    <Label htmlFor="officeCode" className="text-base font-medium">
                      অফিস কোড/office code{" "}
                      <span className="text-sm text-gray-500">(if available)</span>
                    </Label>
                    <Input
                      id="officeCode"
                      type="text"
                      placeholder="i.e. 001"
                      value={formData.officeCode}
                      onChange={(e) => handleInputChange("officeCode", e.target.value)}
                      className="bg-gray-100"
                    />
                  </div>

                  {/* District and Thana */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">
                        জেলা/district <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => handleInputChange("district", value)}
                      >
                        <SelectTrigger className={errors.district ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.value} value={district.value}>
                              {district.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.district && (
                        <p className="text-sm text-red-500 mt-1">{errors.district}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-base font-medium">
                        থানা/thana <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.thana}
                        onValueChange={(value) => handleInputChange("thana", value)}
                      >
                        <SelectTrigger className={errors.thana ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select Thana" />
                        </SelectTrigger>
                        <SelectContent>
                          {thanas.map((thana) => (
                            <SelectItem key={thana.value} value={thana.value}>
                              {thana.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.thana && (
                        <p className="text-sm text-red-500 mt-1">{errors.thana}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="fullAddress" className="text-base font-medium">
                      ঠিকানা/ Address <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="fullAddress"
                      placeholder="i.e. Road 12/A, House 00, Dhanmondi"
                      value={formData.fullAddress}
                      onChange={(e) => handleInputChange("fullAddress", e.target.value)}
                      className={errors.fullAddress ? "border-red-500" : ""}
                      rows={3}
                    />
                    {errors.fullAddress && (
                      <p className="text-sm text-red-500 mt-1">{errors.fullAddress}</p>
                    )}
                  </div>

                  {/* Shipping Method */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      <Truck className="inline mr-2" size={20} />
                      শিপিং মেথড/Shipping Method
                    </Label>
                    <RadioGroup
                      value={formData.shippingMethod}
                      onValueChange={(value) => handleInputChange("shippingMethod", value)}
                      className="space-y-3"
                    >
                      {shippingOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                            {option.label}
                          </Label>
                          <span className="font-semibold text-green-600">
                            Tk {option.cost.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Product List */}
            <Card>
              <CardHeader>
                <CardTitle>অর্ডার আইটেম / Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  const imageUrl = item.product.images && item.product.images[0]
                    ? typeof item.product.images[0] === "string"
                      ? item.product.images[0]
                      : item.product.images[0].asset
                        ? urlFor(item.product.images[0]).url()
                        : "https://via.placeholder.com/60x60?text=No+Image"
                    : "https://via.placeholder.com/60x60?text=No+Image";

                  const price = item.product.status === 'sale' 
                    ? (item.product.salePrice || 0) 
                    : (item.product.regularPrice || 0);

                  return (
                    <div key={item.product._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="relative">
                        <Image
                          src={imageUrl}
                          alt={item.product.name || "Product"}
                          width={60}
                          height={60}
                          className="rounded border object-cover"
                        />
                        <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ৳{(price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Discount Code */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Discount code or gift card"
                    value={formData.discountCode}
                    onChange={(e) => handleInputChange("discountCode", e.target.value)}
                  />
                  <Button variant="outline" className="text-green-600 border-green-600">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal • {items.length} items</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping 🚚</span>
                  <span>৳{shippingCost.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <div className="text-right">
                    <div className="text-green-600">৳{total.toFixed(2)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || items.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold"
                >
                  {loading ? "প্রক্রিয়াকরণ..." : "Confirm Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 