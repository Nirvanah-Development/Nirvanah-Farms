import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./components/AdminSidebar";
import { Toaster } from "sonner";
import { checkAdminAccess } from "@/lib/admin-utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has admin access
  const isAdmin = await checkAdminAccess();
  
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto w-full min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 md:pt-4 sm:pt-6 lg:pt-8">
          {children}
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
} 