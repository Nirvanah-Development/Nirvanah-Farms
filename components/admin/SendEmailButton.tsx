"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail } from "lucide-react";

interface SendEmailButtonProps {
  orderNumber: string;
  customerEmail?: string;
}

export default function SendEmailButton({ orderNumber, customerEmail }: SendEmailButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!customerEmail) {
      toast.error("No email address found for this order");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Order confirmation email sent successfully!");
      } else {
        toast.error(result.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSendEmail}
      disabled={loading || !customerEmail}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Mail size={16} />
      {loading ? "Sending..." : "Send Email"}
    </Button>
  );
} 