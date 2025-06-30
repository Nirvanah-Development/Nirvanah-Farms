import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Logo = ({
  className,
  width = 180,
  height = 60,
}: {
  className?: string;
  spanDesign?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <Link href={"/"} className="inline-flex items-center">
      <div
        className={cn(
          "relative transition-all duration-300 ease-in-out hover:scale-105",
          className
        )}
      >
        <Image
          src="/images/main logoAsset.png"
          alt="Nirvanah Farms Logo"
          width={width}
          height={height}
          priority
          className="w-auto h-auto max-w-full object-contain"
          style={{
            maxHeight: '60px',
            width: 'auto',
          }}
          sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 180px"
        />
      </div>
    </Link>
  );
};

export default Logo;