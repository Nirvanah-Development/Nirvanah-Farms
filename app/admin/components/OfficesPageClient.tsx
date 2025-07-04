"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OfficeTable } from "./OfficeTable";
import { OfficeSearch } from "./OfficeSearch";
import { CreateOfficeDialog } from "./CreateOfficeDialog";

interface Office {
  _id: string;
  officeName: string;
  location: string;
  locationUrl?: string;
  officeCode: string;
  employees: number;
  charitable: number;
  orders?: number;
  target?: string;
  status: string;
  shipDate: string;
  isActive: boolean;
  image?: string;
}

interface OfficesPageClientProps {
  offices: Office[];
  searchParam?: string;
}

export function OfficesPageClient({ offices, searchParam }: OfficesPageClientProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleOfficeUpdated = () => {
    // Refresh the page to show updated office data
    window.location.reload();
  };

  return (
    <div className="space-y-4 sm:space-y-6 ml-0 md:ml-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Partner Offices</h1>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-[#f59e0b] hover:bg-[#d97706] text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-3 sm:p-4">
          <OfficeSearch defaultValue={searchParam} />
        </div>
      </div>

      {/* Office Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <OfficeTable offices={offices} onOfficeUpdated={handleOfficeUpdated} />
      </div>

      {/* Create Office Dialog */}
      <CreateOfficeDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleOfficeUpdated}
      />
    </div>
  );
} 