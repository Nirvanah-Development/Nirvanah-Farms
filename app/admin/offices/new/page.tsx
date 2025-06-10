import { redirect } from "next/navigation";

export default function NewOfficePage() {
  // Redirect to main offices page since creation is now handled by dialog
  redirect("/admin/offices");
} 