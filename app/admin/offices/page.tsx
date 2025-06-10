import { Suspense } from "react";
import { getOffices, searchOffices } from "@/sanity/lib/office-queries";
import { OfficesPageClient } from "../components/OfficesPageClient";

interface OfficesPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function OfficesPage({ searchParams }: OfficesPageProps) {
  const params = await searchParams;
  const offices = params.search 
    ? await searchOffices(params.search)
    : await getOffices();

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading offices...</div>}>
      <OfficesPageClient offices={offices} searchParam={params.search} />
    </Suspense>
  );
} 