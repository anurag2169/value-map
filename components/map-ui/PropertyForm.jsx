"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateInput } from "@/components/ui/date-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCurrentDateValue } from "@/lib/date.js";

export default function PropertyForm({
  formData,
  onChange,
  onSubmit,
  submitting,
}) {
  const currentDate = getCurrentDateValue();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Property Location</CardTitle>
        <CardDescription>
          Add a location using its coordinates, current property rate, and valuation date.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Location</label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Do Batti"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="coordinates" className="text-sm font-medium">Coordinates</label>
            <Input
              id="coordinates"
              name="coordinates"
              placeholder="23.3315, 75.0367"
              value={formData.coordinates}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="rate" className="text-sm font-medium">Rate / sq.ft</label>
            <Input
              id="rate"
              name="rate"
              type="number"
              min="0"
              placeholder="5000"
              value={formData.rate}
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">Date</label>
            <DateInput
              id="date"
              name="date"
              value={formData.date || currentDate}
              onChange={onChange}
              required
            />
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full h-9" disabled={submitting}>
              {submitting ? "Adding..." : "Add Location"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
