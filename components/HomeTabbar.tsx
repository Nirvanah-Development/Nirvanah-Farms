"use client";
import { Category } from "@/sanity.types";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  categories: Category[];
}

const HomeTabbar = ({ selectedTab, onTabSelect, categories }: Props) => {
  return (
    <div className="flex items-center w-full">
      <div className="flex-1 min-w-0">
        <div
          className="flex items-center gap-1.5 md:gap-3 overflow-x-auto scrollbar-hide w-full max-w-full flex-nowrap text-sm font-semibold"
        >
          {categories?.map((category) => (
            <button
              onClick={() => onTabSelect(category?.title || "")}
              key={category?._id}
              className={`whitespace-nowrap border border-shop_light_green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${
                selectedTab === category?.title 
                  ? "bg-shop_light_green text-white border-shop_light_green" 
                  : "bg-shop_light_green/10"
              }`}
            >
              {category?.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTabbar;
