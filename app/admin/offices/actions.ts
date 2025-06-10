"use server";

import { revalidatePath } from "next/cache";
import { updateOfficeStatus, deleteOffice } from "@/sanity/lib/office-queries";
import { auth } from "@clerk/nextjs/server";

export async function updateOfficeStatusAction(officeIds: string[], status: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await updateOfficeStatus(officeIds, status);
    revalidatePath("/admin/offices");
    return { success: true };
  } catch (error) {
    console.error("Error updating office status:", error);
    return { success: false, error: "Failed to update office status" };
  }
}

export async function deleteOfficeAction(officeId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    await deleteOffice(officeId);
    revalidatePath("/admin/offices");
    return { success: true };
  } catch (error) {
    console.error("Error deleting office:", error);
    return { success: false, error: "Failed to delete office" };
  }
} 