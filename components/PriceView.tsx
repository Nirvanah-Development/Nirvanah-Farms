import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";
import PriceFormatter from "./PriceFormatter";

interface Props {
  regularPrice: number | undefined;
  salePrice: number | undefined;
  status?: string;
  className?: string;
}
const PriceView = ({ regularPrice, salePrice, status, className }: Props) => {
  const isSale = status === "sale" && salePrice && salePrice > 0;
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex flex-col md:flex-row items-center md:gap-2">
        <PriceFormatter
          amount={isSale ? salePrice : regularPrice}
          className={cn("text-shop_dark_green", className)}
        />
        {isSale && (
          <PriceFormatter
            amount={regularPrice}
            className={twMerge(
              "line-through text-xs font-normal text-zinc-500",
              className
            )}
          />
        )}
      </div>
    </div>
  );
};

export default PriceView;
