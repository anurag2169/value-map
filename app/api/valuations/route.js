import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { resolveDateInput } from "@/lib/date.js";
import {
    properties,
    valuations,
} from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  await auth.protect();
    try {
        const result = await db
            .select({
                id: valuations.id,
                propertyId: valuations.propertyId,
                name: properties.name,
                latitude: properties.latitude,
                longitude: properties.longitude,
                rate: valuations.rate,
                valuationDate: valuations.valuationDate,
                createdAt: valuations.createdAt,
            })
            .from(valuations)
            .innerJoin(
                properties,
                eq(
                    valuations.propertyId,
                    properties.id
                )
            );

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(
            "Failed to fetch valuations:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch valuations",
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
  await auth.protect();
  try {
    const body = await request.json();

    const {
      name,
      latitude,
      longitude,
      rate,
      valuationDate,
    } = body;

    const normalizedDate = resolveDateInput(valuationDate);

    // Validate required fields
    if (
      !name ||
      latitude === undefined ||
      longitude === undefined ||
      rate === undefined ||
      !normalizedDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // Find property using coordinates
    const existingProperty = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(
            properties.latitude,
            Number(latitude)
          ),
          eq(
            properties.longitude,
            Number(longitude)
          )
        )
      )
      .limit(1);

    let property;

    // Property already exists
    if (existingProperty.length > 0) {
      property = existingProperty[0];

      // Restore property if it was soft deleted
      if (property.isDeleted) {
        const restoredProperty = await db
          .update(properties)
          .set({
            isDeleted: false,
            name,
            updatedAt: new Date(),
          })
          .where(
            eq(properties.id, property.id)
          )
          .returning();

        property = restoredProperty[0];
      }
    } else {
      // Create new property
      const newProperty = await db
        .insert(properties)
        .values({
          name,
          latitude: Number(latitude),
          longitude: Number(longitude),
          isDeleted: false,
        })
        .returning();

      property = newProperty[0];
    }

    // Create new valuation
    const newValuation = await db
      .insert(valuations)
      .values({
        propertyId: property.id,
        rate: Number(rate),
        valuationDate: normalizedDate,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: {
          property,
          valuation: newValuation[0],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Failed to create valuation:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create valuation",
      },
      { status: 500 }
    );
  }
}