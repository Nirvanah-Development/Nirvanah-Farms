"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteOfficeAction } from "../offices/actions";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteOfficeDialogProps {
  officeId: string | null;
  onClose: () => void;
}

export function DeleteOfficeDialog({ officeId, onClose }: DeleteOfficeDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!officeId) return;

    setIsDeleting(true);
    try {
      const result = await deleteOfficeAction(officeId);
      
      if (result.success) {
        toast.success("Office deleted successfully");
        onClose();
      } else {
        toast.error(result.error || "Failed to delete office");
      }
    } catch {
      toast.error("An error occurred while deleting the office");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={!!officeId} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the office
            from your database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 