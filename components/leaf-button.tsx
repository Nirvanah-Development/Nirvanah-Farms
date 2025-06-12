"use client"

import type React from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

interface LeafButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

const LeafButton: React.FC<LeafButtonProps> = ({
  children,
  onClick,
  className,
  size = "default",
  variant = "default",
  disabled = false,
  type = "button",
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      size={size}
      className={cn(
        "relative overflow-hidden font-semibold transition-all duration-300 transform hover:scale-105",
        variant === "default" && "bg-green-600 hover:bg-green-700 text-white border-0",
        variant === "outline" &&
          "bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9)), url('/images/leaves-green-mango-plant.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-700/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </Button>
  )
}

export default LeafButton
