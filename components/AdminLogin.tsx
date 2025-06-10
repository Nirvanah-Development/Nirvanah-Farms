"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Shield } from "lucide-react";

const AdminLogin = () => {
  const { isSignedIn, user } = useUser();
  
  // Check if user has admin role
  const userRole = user?.publicMetadata?.role;
  const isAdmin = userRole === "admin";

  if (isSignedIn && isAdmin) {
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

  if (isSignedIn && !isAdmin) {
    // User is signed in but not an admin - don't show admin link
    return null;
  }

  // Not signed in - show admin login (they'll be checked for role after signing in)
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