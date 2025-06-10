"use server";

import { revalidatePath } from "next/cache";
import { updateOfficeStatus, deleteOffice } from "@/sanity/lib/office-queries";
import { auth } from "@clerk/nextjs/server";
import { checkAdminAccess as isAdmin } from "@/lib/admin-utils";

async function checkAdminAccess() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized - Not signed in");
  }

  const hasAccess = await isAdmin();
  
  if (!hasAccess) {
    throw new Error("Unauthorized - Admin access required");
  }
}

export async function updateOfficeStatusAction(officeIds: string[], status: string) {
  await checkAdminAccess();

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
  await checkAdminAccess();

  try {
    await deleteOffice(officeId);
    revalidatePath("/admin/offices");
    return { success: true };
  } catch (error) {
    console.error("Error deleting office:", error);
    return { success: false, error: "Failed to delete office" };
  }
} 