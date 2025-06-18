"use client";

import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import PriceView from "./PriceView";
import Title from "./Title";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = () => {
    setIsLoading(true);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="text-sm border-[1px] rounded-md border-darkBlue/20 group bg-white flex flex-col h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-md">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-darkBlue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-darkBlue">Loading...</p>
          </div>
        </div>
      )}
      
      <Link 
        href={`/product/${product?.slug?.current}`}
        onClick={handleCardClick}
        className="flex flex-col h-full cursor-pointer"
      >
        <div className="relative group overflow-hidden bg-shop_light_bg rounded-t-md">
          {product?.images && (
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-48 sm:h-56 md:h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg duration-500 hover:scale-105`}
            />
          )}
          {product?.status === "sale" && (
            <p className="absolute top-2 left-2 z-10 text-xs border border-darkColor/50 px-2 py-1 rounded-full group-hover:border-lightGreen hover:text-shop_dark_green hoverEffect bg-white/90">
              Sale!
            </p>
          )}
        </div>
        
        <div className="p-3 flex flex-col gap-2 flex-1">
          {product?.categories && (
            <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
              {product.categories.map((cat) => cat).join(", ")}
            </p>
          )}
          
          <Title className="text-sm min-h-[2.5rem] flex-1">
            {product?.name}
          </Title>

          <div className="mt-auto space-y-2">
            <PriceView
              regularPrice={product?.regularPrice}
              salePrice={product?.salePrice}
              status={product?.status}
              className="text-sm"
            />
            
            <div className="w-full" onClick={handleAddToCartClick}>
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
