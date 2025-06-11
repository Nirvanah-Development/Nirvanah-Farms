import Shop from "@/components/Shop";
import { getCategories } from "@/sanity/queries";
import React, { Suspense } from "react";

const ShopPage = async () => {
  const categories = await getCategories();
  return (
    <div className="bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <Shop categories={categories} />
      </Suspense>
    </div>
  );
};

export default ShopPage;
