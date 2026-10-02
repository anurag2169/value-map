"use client";

import { Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { getRateLevel } from "./constants";

export default function MapPopup({ location, onViewHistory, onDelete, deleting }) {
  const rateLevel = getRateLevel(location.rate);

  return (
    <Popup>
      <div className="w-[min(260px,calc(100vw-60px))] space-y-3 p-1">
        <div>
          <div className="wrap-break-word text-base font-semibold">{location.name}</div>
          <div className="mt-1 text-xs text-gray-500">Property valuation</div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-gray-500">Rate</div>
            <div className="text-lg font-bold">
              ₹{Number(location.rate).toLocaleString("en-IN")}
              <span className="text-xs font-normal text-gray-500"> / sq.ft</span>
            </div>
          </div>
          <span className={`shrink-0 rounded-full border px-2 py-1 text-xs font-medium ${rateLevel.className}`}>
            {rateLevel.label}
          </span>
        </div>

        <div className="wrap-break-word border-t pt-2 text-xs text-gray-500">
          <div><strong>Updated:</strong> {location.date || "N/A"}</div>
          <div><strong>Coordinates:</strong> {location.lat}, {location.lng}</div>
        </div>

        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => onViewHistory(location.id)}>
            View History
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            disabled={deleting}
            onClick={() => onDelete(location.id)}
          >
            {deleting ? "Removing..." : "Remove Marker"}
          </Button>
        </div>
      </div>
    </Popup>
  );
}
