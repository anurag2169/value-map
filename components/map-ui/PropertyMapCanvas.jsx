"use client";

import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RATLAM_CENTER, DEFAULT_MAP_ZOOM, SEARCH_RESULT_ICON } from "./constants";
import { RecenterButton, SearchMapController } from "./MapControls";
import PropertyMarker from "./PropertyMarker";
import MapLegend from "./MapLegend";

export default function PropertyMapCanvas({
  locations,
  mapTarget,
  mapResetKey,
  onViewHistory,
  onDelete,
  deletingId,
  loading,
}) {
  const searchCoordinates = mapTarget?.coordinates;
  const searchRadius = mapTarget?.radius ?? 200;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Property Valuation Map</CardTitle>
        <CardDescription>
          Explore property rates across Ratlam. Marker colors represent the valuation range.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 p-0">
        <div className="relative h-[500px] sm:h-[600px]">
          {loading && (
            <div className="absolute left-0 right-0 top-0 z-[1000] bg-white/90 px-4 py-3 text-sm text-muted-foreground">
              Loading property locations...
            </div>
          )}

          <MapContainer center={RATLAM_CENTER} zoom={DEFAULT_MAP_ZOOM} className="h-full w-full">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterButton />
            <SearchMapController mapTarget={mapTarget} mapResetKey={mapResetKey} />

            {searchCoordinates && (
              <>
                <Circle
                  center={searchCoordinates}
                  radius={searchRadius}
                  pathOptions={{
                    color: "#2563eb",
                    fillColor: "#93c5fd",
                    fillOpacity: 0.2,
                    weight: 2,
                  }}
                />
                <Marker position={searchCoordinates} icon={SEARCH_RESULT_ICON} />
              </>
            )}

            {locations.map((location) => (
              <PropertyMarker
                key={location.id}
                location={location}
                onViewHistory={onViewHistory}
                onDelete={onDelete}
                deleting={deletingId === location.id}
              />
            ))}
          </MapContainer>

          <MapLegend />
        </div>
      </CardContent>
    </Card>
  );
}
