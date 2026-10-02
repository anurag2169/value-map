"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const levels = [
  { key: "low", label: "Low", range: "< ₹4.5k", dot: "bg-blue-600" },
  { key: "medium", label: "Medium", range: "₹4.5k–5.5k", dot: "bg-green-600" },
  { key: "high", label: "High", range: "> ₹5.5k", dot: "bg-red-600" },
];

export default function MapLegend() {
  return (
    <div className="absolute right-2 top-2 z-1000">
      <Card className="w-42.5 max-w-[calc(100vw-24px)] shadow-lg">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Rate Level</CardTitle>
          <CardDescription className="text-xs">Based on ₹ / sq.ft</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 p-3 pt-1">
          {levels.map((level) => (
            <div key={level.key} className="flex items-center gap-2 text-xs">
              <span className={`h-3 w-3 shrink-0 rounded-full ${level.dot}`} />
              <span>{level.label}</span>
              <span className="ml-auto whitespace-nowrap text-muted-foreground">{level.range}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
