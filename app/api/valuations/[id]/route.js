import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { valuations } from "@/lib/db/schema";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const valuationId = Number(id);

    if (Number.isNaN(valuationId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid valuation ID",
        },
        { status: 400 }
      );
    }

    const deletedValuation = await db
      .delete(valuations)
      .where(eq(valuations.id, valuationId))
      .returning({
        id: valuations.id,
      });

    if (deletedValuation.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valuation not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Valuation deleted permanently",
      data: deletedValuation[0],
    });
  } catch (error) {
    console.error("Failed to delete valuation:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete valuation",
      },
      { status: 500 }
    );
  }
}
