import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import { getCategories } from "@/sanity/queries";
import { CartSidebarProvider } from "@/components/CartSidebarContext";
import CartSidebarWrapper from "@/components/CartSidebarWrapper";

import React from "react";

const Home = async () => {
  const categories = await getCategories(6);

  return (
    <CartSidebarProvider>
      <Container className="bg-shop-light-pink">
        <HomeBanner />
        <ProductGrid categories={categories} />
        <HomeCategories categories={categories} />
        <ShopByBrands />
        <LatestBlog />
      </Container>
      <CartSidebarWrapper />
    </CartSidebarProvider>
  );
};

export default Home;
