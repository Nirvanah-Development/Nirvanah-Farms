"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SupportStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staffCount: number;
  staffNames: { name: string }[];
  onStaffNamesChange: (names: { name: string }[]) => void;
}

export function SupportStaffDialog({
  isOpen,
  onClose,
  staffCount,
  staffNames,
  onStaffNamesChange,
}: SupportStaffDialogProps) {
  const [localStaffNames, setLocalStaffNames] = useState<{ name: string }[]>(
    Array.from({ length: staffCount }, (_, i) => staffNames[i] || { name: "" })
  );

  const handleNameChange = (index: number, name: string) => {
    const updatedNames = [...localStaffNames];
    updatedNames[index] = { name };
    setLocalStaffNames(updatedNames);
  };

  const handleSave = () => {
    onStaffNamesChange(localStaffNames);
    onClose();
  };

  const handleClose = () => {
    // Reset to original values
    setLocalStaffNames(
      Array.from({ length: staffCount }, (_, i) => staffNames[i] || { name: "" })
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Office Support Staffs (total {staffCount})
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {Array.from({ length: staffCount }, (_, index) => (
            <div key={index}>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Person {index + 1}</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    His/Her Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter Name"
                    value={localStaffNames[index]?.name || ""}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              
              {index < staffCount - 1 && (
                <hr className="mt-6 border-gray-200" />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-6">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md"
          >
            +Add office support staffs
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 