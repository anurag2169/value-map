import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import {
  properties,
  valuations,
} from "@/lib/db/schema";

export async function GET() {
  try {
    const result = await db.execute(`
      SELECT
        p.id,
        p.name,
        p.latitude,
        p.longitude,
        v.rate,
        v.valuation_date AS "valuationDate"
      FROM properties p
      LEFT JOIN LATERAL (
        SELECT
          rate,
          valuation_date
        FROM valuations
        WHERE property_id = p.id
        ORDER BY valuation_date DESC, id DESC
        LIMIT 1
      ) v ON true
      WHERE p.is_deleted = false
      ORDER BY p.id;
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "Failed to fetch properties:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
      },
      { status: 500 }
    );
  }
}