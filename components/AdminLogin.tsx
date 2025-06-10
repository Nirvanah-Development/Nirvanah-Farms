"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <Link 
        href="/admin" 
        className="flex items-center gap-2 text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect"
      >
        <Shield className="w-4 h-4" />
        Admin Panel
      </Link>
    );
  }

  return (
    <Link 
      href="/sign-in" 
      className="flex items-center gap-2 text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect"
    >
      <Shield className="w-4 h-4" />
      Admin Login
    </Link>
  );
};

export default AdminLogin; 