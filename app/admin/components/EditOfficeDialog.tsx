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
import { getOfficeForEdit, updateOfficeAction } from "../offices/[id]/edit/actions";
import { toast } from "sonner";

interface EditOfficeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  officeId: string;
}

interface FormData {
  officeName: string;
  location: string;
  locationUrl: string;
  phone: string;
  email: string;
  employees: number;
  charitable: number;
  orders: number;
  target: string;
  shipDate: Date | undefined;
  description: string;
}

interface OfficeData {
  _id: string;
  officeName: string;
  location: string;
  locationUrl?: string;
  phone?: string;
  email?: string;
  officeCode: string;
  employees: number;
  charitable: number;
  orders?: number;
  target?: string;
  shipDate: string;
  description?: string;
  supportStaff?: { name: string }[];
  image?: any;
}

export function EditOfficeDialog({ isOpen, onClose, onSuccess, officeId }: EditOfficeDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    officeName: "",
    location: "",
    locationUrl: "",
    phone: "",
    email: "",
    employees: 0,
    charitable: 0,
    orders: 0,
    target: "",
    shipDate: undefined,
    description: "",
  });

  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [officeCode, setOfficeCode] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [supportStaff, setSupportStaff] = useState<{ name: string }[]>([]);
  const [originalSupportStaff, setOriginalSupportStaff] = useState<{ name: string }[]>([]);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load office data when dialog opens
  useEffect(() => {
    if (isOpen && officeId) {
      loadOfficeData();
    }
  }, [isOpen, officeId]);

  const loadOfficeData = async () => {
    setIsLoading(true);
    try {
      const result = await getOfficeForEdit(officeId);
      if (result.success && result.office) {
        const office: OfficeData = result.office;
        const data = {
          officeName: office.officeName || "",
          location: office.location || "",
          locationUrl: office.locationUrl || "",
          phone: office.phone || "",
          email: office.email || "",
          employees: office.employees || 0,
          charitable: office.charitable || 0,
          orders: office.orders || 0,
          target: office.target || "",
          shipDate: office.shipDate ? new Date(office.shipDate) : undefined,
          description: office.description || "",
        };
        
        setFormData(data);
        setOriginalData(data);
        setOfficeCode(office.officeCode);
        setSupportStaff(office.supportStaff || []);
        setOriginalSupportStaff(office.supportStaff || []);
        
        // Handle existing images
        if (office.image) {
          setExistingImages([office.image]);
        } else {
          setExistingImages([]);
        }
      } else {
        toast.error(result.error || "Failed to load office data");
        onClose();
      }
    } catch (error) {
      toast.error("An error occurred while loading office data");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

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
  }, [formData.charitable, supportStaff.length]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Check if form has changes
  const hasChanges = () => {
    if (!originalData) return false;
    
    // Check form data changes
    const dataChanged = Object.keys(formData).some(key => {
      const field = key as keyof FormData;
      if (field === 'shipDate') {
        const originalDate = originalData[field]?.toISOString().split('T')[0];
        const currentDate = formData[field]?.toISOString().split('T')[0];
        return originalDate !== currentDate;
      }
      return formData[field] !== originalData[field];
    });

    // Check support staff changes
    const staffChanged = JSON.stringify(supportStaff) !== JSON.stringify(originalSupportStaff);
    
    // Check new images added
    const imagesChanged = selectedImages.length > 0;

    return dataChanged || staffChanged || imagesChanged;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.officeName || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateOfficeAction(officeId, {
        officeName: formData.officeName,
        location: formData.location,
        locationUrl: formData.locationUrl || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        employees: formData.employees,
        charitable: formData.charitable,
        orders: formData.orders || undefined,
        target: formData.target || undefined,
        shipDate: formData.shipDate ? formData.shipDate.toISOString() : new Date().toISOString(),
        description: formData.description || undefined,
        supportStaff: supportStaff.filter(staff => staff.name.trim()),
      });

      if (result.success) {
        toast.success("Office updated successfully!");
        handleClose();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to update office");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error updating office:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    // Reset form to original state
    if (originalData) {
      setFormData(originalData);
      setSupportStaff(originalSupportStaff);
    }
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

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading office data...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-semibold">Edit Office</DialogTitle>
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
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Images</Label>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Image</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Add New Images</Label>
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
                  <Label htmlFor="phone" className="text-sm font-medium">Permanent Phone:</Label>
                  <Input 
                    id="phone"
                    placeholder="Phone number" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1" 
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Permanent email:</Label>
                  <Input 
                    id="email"
                    placeholder="Email address" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1" 
                  />
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
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={openStaffDialog}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        + Add their name
                      </Button>
                      
                      {/* Show current support staff */}
                      {supportStaff.length > 0 && supportStaff.some(staff => staff.name.trim()) && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-2">Support Staff:</p>
                          <ol className="text-sm text-gray-600 space-y-1">
                            {supportStaff.map((staff, index) => (
                              staff.name.trim() && (
                                <li key={index}>
                                  {index + 1}. {staff.name}
                                </li>
                              )
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
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
                  <Label className="text-sm font-medium">Ship Date</Label>
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
                disabled={isSubmitting || !hasChanges()}
                className={`px-8 py-2 ${
                  hasChanges() 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Updating..." : "Done"}
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