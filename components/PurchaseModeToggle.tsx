"use client";

import { usePurchaseModeStore } from "@/store/purchaseMode";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export function PurchaseModeToggle() {
  const purchaseMode = usePurchaseModeStore((state) => state.purchaseMode);
  const setPurchaseMode = usePurchaseModeStore((state) => state.setPurchaseMode);
  
  const [individualWidth, setIndividualWidth] = useState(0);
  const [groupWidth, setGroupWidth] = useState(0);

  const individualRef = useRef<HTMLButtonElement>(null);
  const groupRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (individualRef.current) {
      setIndividualWidth(individualRef.current.clientWidth);
    }
    if (groupRef.current) {
      setGroupWidth(groupRef.current.clientWidth);
    }
  }, []);

  return (
    <div
      className="
        relative
        h-9 sm:h-10 
        border border-gray-200 
        rounded-full
        p-0.5
        flex items-center
        transition-colors duration-200 ease-in-out
      "
    >
      <button
        ref={individualRef}
        onClick={() => setPurchaseMode('individual')}
        className="
          relative z-10
          text-xs sm:text-sm
          px-4 sm:px-5
          h-full
          rounded-full
          transition-colors duration-200 ease-in-out
        "
      >
        <span className={purchaseMode === 'individual' ? 'text-white' : 'text-black'}>
          Individual Purchase
        </span>
      </button>
      <button
        ref={groupRef}
        onClick={() => setPurchaseMode('group')}
        className="
          relative z-10
          text-xs sm:text-sm
          px-4 sm:px-5
          h-full
          rounded-full
          transition-colors duration-200 ease-in-out
        "
      >
        <span className={purchaseMode === 'group' ? 'text-white' : 'text-black'}>
          Group Purchase
        </span>
      </button>
      
      {purchaseMode && (
        <motion.div
          layoutId="purchaseMode"
          className="
            absolute top-0.5 bottom-0.5
            h-[calc(100%-4px)]
            rounded-full
            bg-shop_light_green
          "
          style={{
            left: purchaseMode === 'individual' ? '2px' : 'auto',
            right: purchaseMode === 'group' ? '2px' : 'auto',
            width: purchaseMode === 'individual' ? individualWidth : groupWidth
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      )}
      <span id="individual-btn" className="hidden">Individual Purchase</span>
      <span id="group-btn" className="hidden">Group Purchase</span>
    </div>
  );
} 