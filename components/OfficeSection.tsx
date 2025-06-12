"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MapPin, Building2, Hash } from "lucide-react";
import OfficeRegistrationModal from "./OfficeRegistrationModal";

interface OfficeData {
  code: string;
  name: string;
  location: string;
  image: string;
}

interface OfficeSectionProps {
  office?: OfficeData | null;
  isConnected?: boolean;
}

const OfficeSection: React.FC<OfficeSectionProps> = ({ 
  office = null, 
  isConnected = false 
}) => {
  const [officeCode, setOfficeCode] = useState("");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement office connection logic
    console.log("Connecting to office with code:", officeCode);
  };

  const ConnectedOfficeView = () => (
    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
      {/* Office Image */}
      <div className="w-full lg:w-1/3 flex-shrink-0">
        <div className="aspect-video lg:aspect-square rounded-lg overflow-hidden shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={office?.image || "/images/greenback.jpg"}
            alt={office?.name || "Office"}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Office Details */}
      <div className="flex-1 space-y-4 text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <Hash className="h-5 w-5 text-shop_light_green" />
          <span className="text-sm font-medium text-gray-600">
            Code: {office?.code || "001"}
          </span>
        </div>
        
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
          {office?.name || "Dutch Bangla Bank Ltd."}
        </h2>
        
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <MapPin className="h-5 w-5 text-shop_light_green" />
          <span className="text-gray-600">
            {office?.location || "Satmasjid Road, Dhanmondi"}
          </span>
        </div>
      </div>
    </div>
  );

  const NotConnectedView = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <Building2 className="h-16 w-16 text-shop_light_green" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800">
        Connect to Your Office
      </h2>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Enter your office code"
            value={officeCode}
            onChange={(e) => setOfficeCode(e.target.value)}
            className="flex-1 h-12 text-center sm:text-left"
            required
          />
          <Button 
            type="submit"
            className="h-12 px-8 bg-gray-800 hover:bg-gray-700 text-white"
          >
            Submit
          </Button>
        </div>
      </form>
      
      <div className="text-sm text-gray-600">
        <span>office not included yet? </span>
        <button
          onClick={() => setIsRegistrationModalOpen(true)}
          className="text-shop_light_green hover:underline font-medium"
        >
          let&apos;s include
        </button>
      </div>
    </div>
  );

  return (
    <>
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {isConnected && office ? (
            <ConnectedOfficeView />
          ) : (
            <NotConnectedView />
          )}
        </div>
      </section>

      <OfficeRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </>
  );
};

export default OfficeSection; 