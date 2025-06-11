"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X } from "lucide-react";

interface OfficeRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  contactNumber: string;
  email: string;
  corporationName: string;
  location: string;
  googleMapLocation: string;
  numberOfEmployees: string;
}

const OfficeRegistrationModal: React.FC<OfficeRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    contactNumber: "",
    email: "",
    corporationName: "",
    location: "",
    googleMapLocation: "",
    numberOfEmployees: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement office registration logic
    console.log("Office registration data:", formData);
    // Reset form and close modal
    setFormData({
      name: "",
      contactNumber: "",
      email: "",
      corporationName: "",
      location: "",
      googleMapLocation: "",
      numberOfEmployees: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 h-[500px] overflow-hidden">
        <div className="flex h-full">
          {/* Left Section - Office Image */}
          <div className="relative w-[30%] min-w-[250px] overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/greenback.jpg')",
                clipPath: "polygon(0 0, 85% 0, 100% 100%, 0 100%)"
              }}
            />
            
            {/* Overlay for better text readability */}
            <div 
              className="absolute inset-0 bg-green-900/30"
              style={{
                clipPath: "polygon(0 0, 85% 0, 100% 100%, 0 100%)"
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center p-6 text-white">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Join Our Network</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Register your office to start ordering fresh, organic produce directly from our farms.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 hover:bg-white/80 rounded-full transition-colors bg-white/60"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Header */}
            <div className="px-8 pt-6 pb-4">
              <h2 className="text-2xl font-bold text-gray-800">General Information</h2>
              <p className="text-sm text-gray-600 mt-1">Please fill in your office details</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-6 h-[calc(100%-100px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Your Name */}
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Your Contact Number */}
                <div className="space-y-1">
                  <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                    Contact Number
                  </Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Your email */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Name of the corporation */}
                <div className="space-y-1">
                  <Label htmlFor="corporationName" className="text-sm font-medium text-gray-700">
                    Corporation Name
                  </Label>
                  <Input
                    id="corporationName"
                    name="corporationName"
                    type="text"
                    placeholder="Corporation name"
                    value={formData.corporationName}
                    onChange={handleInputChange}
                    className="w-full h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Thana, City"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Number of employees */}
                <div className="space-y-1">
                  <Label htmlFor="numberOfEmployees" className="text-sm font-medium text-gray-700">
                    Number of Employees
                  </Label>
                  <Input
                    id="numberOfEmployees"
                    name="numberOfEmployees"
                    type="number"
                    placeholder="0"
                    value={formData.numberOfEmployees}
                    onChange={handleInputChange}
                    className="w-full h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    min="0"
                  />
                </div>
              </div>

              {/* Google map location link - Full width */}
              <div className="space-y-1 mt-4">
                <Label htmlFor="googleMapLocation" className="text-sm font-medium text-gray-700">
                  Google Map Location Link
                </Label>
                <Input
                  id="googleMapLocation"
                  name="googleMapLocation"
                  type="url"
                  placeholder="Paste Google Maps link"
                  value={formData.googleMapLocation}
                  onChange={handleInputChange}
                  className="w-full h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Submit Button and Footer */}
              <div className="mt-6 space-y-4">
                <Button
                  type="submit"
                  className="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Submit Registration
                </Button>

                {/* Footer Text */}
                <div className="text-xs text-green-700 text-center leading-relaxed bg-green-50 p-3 rounded-lg">
                  After you submit this form, we&apos;ll generate an office code and
                  let you and your colleagues place orders with Linah Farms.
                  We&apos;ll collect an office photo and any other details later.
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeRegistrationModal; 