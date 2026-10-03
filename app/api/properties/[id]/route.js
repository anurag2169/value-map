import { NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  properties,
  valuations,
} from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function GET(request, { params }) {
  await auth.protect();
  const start = Date.now();

  try {
    const { id } = await params;
    const propertyId = Number(id);

    if (Number.isNaN(propertyId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid property ID",
        },
        { status: 400 }
      );
    }

    const result = await db.execute(`
      SELECT
        p.id,
        p.name,
        p.latitude,
        p.longitude,
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",

        COALESCE(
          json_agg(
            json_build_object(
              'id', v.id,
              'rate', v.rate,
              'valuationDate', v.valuation_date,
              'createdAt', v.created_at
            )
            ORDER BY v.valuation_date ASC, v.id ASC
          ) FILTER (WHERE v.id IS NOT NULL),
          '[]'::json
        ) AS valuations

      FROM properties p

      LEFT JOIN valuations v
        ON v.property_id = p.id

      WHERE p.id = ${propertyId}

      GROUP BY
        p.id,
        p.name,
        p.latitude,
        p.longitude,
        p.created_at,
        p.updated_at;
    `);

    console.log(
      "History API:",
      Date.now() - start,
      "ms"
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Property not found",
        },
        { status: 404 }
      );
    }

    const row = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        property: {
          id: row.id,
          name: row.name,
          latitude: row.latitude,
          longitude: row.longitude,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
        valuations: row.valuations || [],
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch property:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch property",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const propertyId = Number(id);

    if (Number.isNaN(propertyId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid property ID",
        },
        { status: 400 }
      );
    }

    const deletedProperty = await db
      .update(properties)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, propertyId))
      .returning({
        id: properties.id,
      });

    if (deletedProperty.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Property not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Property removed successfully",
      data: deletedProperty[0],
    });
  } catch (error) {
    console.error(
      "Failed to remove property:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove property",
      },
      { status: 500 }
    );
  }
}