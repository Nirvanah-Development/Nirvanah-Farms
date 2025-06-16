import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(request: NextRequest) {
  try {
    const { discountCodeId } = await request.json();

    if (!discountCodeId) {
      return NextResponse.json(
        { error: "Discount code ID is required" },
        { status: 400 }
      );
    }

    // Increment the usage count
    const result = await writeClient
      .patch(discountCodeId)
      .inc({ currentUsageCount: 1 })
      .commit();

    return NextResponse.json({
      success: true,
      updatedUsageCount: result.currentUsageCount,
    });

  } catch (error) {
    console.error("Error updating discount usage:", error);
    return NextResponse.json(
      { error: "Failed to update discount usage" },
      { status: 500 }
    );
  }
} 