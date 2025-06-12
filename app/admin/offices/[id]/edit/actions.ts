"use server";

import { updateOffice, getOfficeById } from "@/sanity/lib/office-queries";
import { revalidatePath } from "next/cache";

export interface UpdateOfficeData {
  officeName: string;
  location: string;
  locationUrl?: string;
  phone?: string;
  email?: string;
  employees: number;
  charitable: number;
  orders?: number;
  target?: string;
  shipDate: string;
  description?: string;
  supportStaff?: { name: string }[];
}

export async function getOfficeForEdit(officeId: string) {
  try {
    const office = await getOfficeById(officeId);
    if (!office) {
      return { success: false, error: "Office not found" };
    }
    return { success: true, office };
  } catch (error) {
    console.error("Error fetching office:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch office" 
    };
  }
}

export async function updateOfficeAction(officeId: string, data: UpdateOfficeData) {
  try {
    const result = await updateOffice(officeId, data);
    
    if (result) {
      revalidatePath("/admin/offices");
      return { success: true, office: result };
    } else {
      return { success: false, error: "Failed to update office" };
    }
  } catch (error) {
    console.error("Error updating office:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
} 