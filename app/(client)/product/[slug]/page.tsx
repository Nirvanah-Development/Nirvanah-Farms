import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import { getProductBySlug } from "@/sanity/queries";
import { StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import { PortableText, PortableTextMarkComponentProps } from '@portabletext/react';

interface LinkMarkValue {
  _type: 'link';
  href?: string;
  target?: string;
}

const components = {
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<LinkMarkValue>) => {
      const rel = value?.target === '_blank' ? 'noopener noreferrer' : undefined
      return (
        <a
          href={value?.href}
          target={value?.target}
          rel={rel}
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      )
    },
  },
}

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }
  return (
    <Container className="flex flex-col md:flex-row gap-10 py-10">
      {product?.images && (
        <ImageView images={product?.images} />
      )}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{product?.name}</h2>
          <div className="text-sm text-gray-600 tracking-wide">
            {product?.description && <PortableText value={product.description} components={components} />}
          </div>
          <div className="flex items-center gap-0.5 text-xs">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className="text-shop_light_green"
                fill={"#3b9c3c"}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2 border-t border-b border-gray-200 py-5">
          <PriceView
            regularPrice={product?.regularPrice}
            salePrice={product?.salePrice}
            status={product?.status}
            className="text-lg font-bold"
          />
        </div>
        <div className="flex items-center gap-2.5 lg:gap-3">
          <AddToCartButton product={product} />
        </div>
      </div>
    </Container>
  );
};

export default SingleProductPage;
