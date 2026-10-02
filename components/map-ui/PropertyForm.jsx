"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PropertyForm({
  formData,
  onChange,
  onSubmit,
  submitting,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Property Location</CardTitle>
        <CardDescription>
          Add a location using its coordinates and current property rate.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="flex items-end">
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Adding..." : "Add Location"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
