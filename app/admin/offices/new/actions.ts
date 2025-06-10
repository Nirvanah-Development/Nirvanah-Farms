"use server";

import { createOffice, getExistingOfficeCodes } from "@/sanity/lib/office-queries";
import { getNextOfficeCode } from "@/lib/officeCodes";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface CreateOfficeData {
  officeName: string;
  location: string;
  locationUrl?: string;
  employees: number;
  charitable: number;
  orders: number;
  target?: string;
  shipDate: string;
  description?: string;
  supportStaff?: { name: string }[];
}

export async function createOfficeAction(data: CreateOfficeData) {
  try {
    // Get existing office codes to generate the next sequential code
    const existingCodes = await getExistingOfficeCodes();
    const nextCode = getNextOfficeCode(existingCodes);

    // Create the office
    const result = await createOffice({
      ...data,
      officeCode: nextCode,
      status: "processing", // Default status
    });

    if (result._id) {
      revalidatePath("/admin/offices");
      return { success: true, office: result };
    } else {
      return { success: false, error: "Failed to create office" };
    }
  } catch (error) {
    console.error("Error creating office:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}

export async function getNextOfficeCodeAction() {
  try {
    const existingCodes = await getExistingOfficeCodes();
    return getNextOfficeCode(existingCodes);
  } catch (error) {
    console.error("Error getting next office code:", error);
    return "001"; // Fallback
  }
} 