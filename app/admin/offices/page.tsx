import { Suspense } from "react";
import { getOffices, searchOffices } from "@/sanity/lib/office-queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { OfficeTable } from "../components/OfficeTable";
import { OfficeSearch } from "../components/OfficeSearch";

interface OfficesPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function OfficesPage({ searchParams }: OfficesPageProps) {
  const params = await searchParams;
  const offices = params.search 
    ? await searchOffices(params.search)
    : await getOffices();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">All Partner Offices</h1>
        <Link href="/admin/offices/new">
          <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
          <OfficeSearch defaultValue={params.search} />
        </div>
      </div>

      {/* Office Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Suspense fallback={<div className="p-8 text-center">Loading offices...</div>}>
          <OfficeTable offices={offices} />
        </Suspense>
      </div>
    </div>
  );
} 