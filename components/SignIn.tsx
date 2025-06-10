"use client";
import { SignInButton } from "@clerk/nextjs";
import React from "react";

interface SignInProps {
  mode?: "modal" | "redirect";
  redirectUrl?: string;
}

const SignIn = ({ mode = "modal", redirectUrl }: SignInProps) => {
  return (
    <SignInButton mode={mode} forceRedirectUrl={redirectUrl}>
      <button className="text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect">
        Login
      </button>
    </SignInButton>
  );
};

export default SignIn;
