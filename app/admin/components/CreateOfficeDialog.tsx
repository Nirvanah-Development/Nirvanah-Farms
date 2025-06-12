"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ImageUpload } from "./ImageUpload";
import { SupportStaffDialog } from "./SupportStaffDialog";
import { createOfficeAction, getNextOfficeCodeAction } from "../offices/new/actions";
import { toast } from "sonner";

interface CreateOfficeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  officeName: string;
  location: string;
  locationUrl: string;
  employees: number;
  charitable: number;
  orders: number;
  target: string;
  shipDate: Date | undefined;
  description: string;
}

export function CreateOfficeDialog({ isOpen, onClose, onSuccess }: CreateOfficeDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    officeName: "",
    location: "",
    locationUrl: "",
    employees: 0,
    charitable: 0,
    orders: 0,
    target: "",
    shipDate: undefined,
    description: "",
  });

  const [officeCode, setOfficeCode] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [supportStaff, setSupportStaff] = useState<{ name: string }[]>([]);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get next office code when dialog opens
  useEffect(() => {
    if (isOpen) {
      getNextOfficeCodeAction().then(setOfficeCode);
    }
  }, [isOpen]);

  // Update support staff array when charitable count changes
  useEffect(() => {
    const currentLength = supportStaff.length;
    const newLength = formData.charitable;

    if (newLength !== currentLength) {
      if (newLength > currentLength) {
        // Add empty staff entries
        const newStaff = [...supportStaff];
        for (let i = currentLength; i < newLength; i++) {
          newStaff.push({ name: "" });
        }
        setSupportStaff(newStaff);
      } else {
        // Remove excess staff entries
        setSupportStaff(supportStaff.slice(0, newLength));
      }
    }
  }, [formData.charitable, supportStaff]);

  const handleInputChange = (field: keyof FormData, value: string | number | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.officeName || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createOfficeAction({
        officeName: formData.officeName,
        location: formData.location,
        locationUrl: formData.locationUrl || undefined,
        employees: formData.employees,
        charitable: formData.charitable,
        orders: formData.orders,
        target: formData.target || undefined,
        shipDate: formData.shipDate ? formData.shipDate.toISOString() : new Date().toISOString(),
        description: formData.description || undefined,
        supportStaff: supportStaff.filter(staff => staff.name.trim()),
      });

      if (result.success) {
        toast.success("Office created successfully!");
        handleClose();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to create office");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error creating office:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    // Reset form
    setFormData({
      officeName: "",
      location: "",
      locationUrl: "",
      employees: 0,
      charitable: 0,
      orders: 0,
      target: "",
      shipDate: undefined,
      description: "",
    });
    setSupportStaff([]);
    setOfficeCode("");
    setSelectedImages([]);
    onClose();
  };

  const openStaffDialog = () => {
    if (formData.charitable > 0) {
      setIsStaffDialogOpen(true);
    } else {
      toast.error("Please enter the number of charitable employees first");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-semibold">Add New Office</DialogTitle>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded">
                Code: {officeCode}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Office Images</Label>
              <ImageUpload onImagesChange={setSelectedImages} />
            </div>

            {/* General Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">General information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="officeName" className="text-sm font-medium">
                  Name of the corporation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="officeName"
                  placeholder="corporation name"
                  value={formData.officeName}
                  onChange={(e) => handleInputChange("officeName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="thana,city"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationUrl" className="text-sm font-medium">
                  google map link
                </Label>
                <Input
                  id="locationUrl"
                  placeholder="google map location"
                  value={formData.locationUrl}
                  onChange={(e) => handleInputChange("locationUrl", e.target.value)}
                />
              </div>
            </div>

            {/* Contacts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Permanent Phone:</Label>
                  <Input placeholder="Phone number" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Permanent email:</Label>
                  <Input placeholder="Email address" type="email" className="mt-1" />
                </div>
              </div>
            </div>

            {/* Celebration Gifts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Celebration Gifts</h3>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">write a note</Label>
                <Textarea
                  id="description"
                  placeholder="Add description..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employees" className="text-sm font-medium">
                    Number of partner employee
                  </Label>
                  <Input
                    id="employees"
                    type="number"
                    min="0"
                    value={formData.employees || ""}
                    onChange={(e) => handleInputChange("employees", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charitable" className="text-sm font-medium">
                    number of charitable employee
                  </Label>
                  <Input
                    id="charitable"
                    type="number"
                    min="0"
                    value={formData.charitable || ""}
                    onChange={(e) => handleInputChange("charitable", parseInt(e.target.value) || 0)}
                  />
                  {formData.charitable > 0 && (
                    <Button
                      type="button"
                      onClick={openStaffDialog}
                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                    >
                      + Add their name
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target" className="text-sm font-medium">
                    target amount (kg)
                  </Label>
                  <Input
                    id="target"
                    placeholder="e.g. 125"
                    value={formData.target}
                    onChange={(e) => handleInputChange("target", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">*based on partner and charitable employee</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orders" className="text-sm font-medium">Orders</Label>
                  <Input
                    id="orders"
                    type="number"
                    min="0"
                    placeholder="e.g. 75"
                    value={formData.orders || ""}
                    onChange={(e) => handleInputChange("orders", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Ship Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.shipDate ? format(formData.shipDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.shipDate}
                        onSelect={(date) => handleInputChange("shipDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
              >
                {isSubmitting ? "Creating..." : "+ Add Office"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Support Staff Dialog */}
      <SupportStaffDialog
        isOpen={isStaffDialogOpen}
        onClose={() => setIsStaffDialogOpen(false)}
        staffCount={formData.charitable}
        staffNames={supportStaff}
        onStaffNamesChange={setSupportStaff}
      />
    </>
  );
} 