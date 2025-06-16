"use client";

import { useCartStore } from "@/store/cart";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

const SuccessPageContent = () => {
  const { resetCart } = useCartStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderNumber || orderId) {
      resetCart();
    }
  }, [orderNumber, orderId, resetCart]);

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl flex flex-col gap-8 shadow-2xl p-6 md:p-8 max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <Check className="text-white w-10 h-10" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            অর্ডার নিশ্চিত হয়েছে!
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-green-600">
            Order Confirmed!
          </h2>
        </div>

        <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            আপনার কেনাকাটার জন্য ধন্যবাদ। আমরা আপনার অর্ডার প্রক্রিয়া করছি এবং শীঘ্রই পাঠাবো।
          </p>
          <p className="text-gray-700 leading-relaxed">
            Thank you for your purchase. We&apos;re processing your order and
            will ship it soon via Cash on Delivery (COD).
          </p>
          
          {(orderNumber || orderId) && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 font-medium">
                অর্ডার নম্বর / Order Number:{" "}
                <span className="text-green-600 font-bold text-lg">
                  {orderNumber || orderId}
                </span>
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <span className="text-lg">💰</span>
              <span>Payment Method: Cash on Delivery (COD)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
              <span className="text-lg">📧</span>
              <span>Order confirmation email sent</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link
            href="/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" />
            My Orders
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order confirmation...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
