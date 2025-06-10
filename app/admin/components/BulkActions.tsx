"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { updateOfficeStatusAction } from "../offices/actions";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedOffices: string[];
  onComplete: () => void;
}

export function BulkActions({ selectedOffices, onComplete }: BulkActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (status: string) => {
    if (selectedOffices.length === 0) {
      toast.error("Please select at least one office");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateOfficeStatusAction(selectedOffices, status);
      
      if (result.success) {
        toast.success(`Updated ${selectedOffices.length} office(s) status to ${status}`);
        onComplete();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isLoading}>
            Bulk Actions
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleStatusChange("gifted")}>
            Change status to Gifted
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("target_filled")}>
            Change status to Target filled
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("donated")}>
            Change status to Donated
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={() => {
          if (selectedOffices.length === 0) {
            toast.error("Please select at least one office");
            return;
          }
          toast.info(`${selectedOffices.length} office(s) selected`);
        }}
        variant="secondary"
        disabled={isLoading}
      >
        Apply
      </Button>

      {selectedOffices.length > 0 && (
        <span className="text-sm text-gray-600">
          {selectedOffices.length} selected
        </span>
      )}
    </div>
  );
} 