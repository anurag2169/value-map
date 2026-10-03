"use client";

import "leaflet/dist/leaflet.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MapSearch from "./MapSearch";
import PropertyForm from "./PropertyForm";
import PropertyMapCanvas from "./PropertyMapCanvas";
import PropertyHistoryDialog from "./PropertyHistoryDialog";
import useValueMap from "./hooks/useValueMap";

export default function ValueMap() {
  const mapState = useValueMap();

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <PropertyForm
          formData={mapState.formData}
          onChange={mapState.updateFormField}
          onSubmit={mapState.addValuation}
          submitting={mapState.submitting}
        />

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Search Location</CardTitle>
            <CardDescription>
              Search by saved property name, OpenStreetMap place name, or latitude and longitude.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-2xl">
              <MapSearch
                locations={mapState.locations}
                onSearchCoordinates={mapState.searchCoordinates}
                onSearchLocation={mapState.searchLocation}
                onClear={mapState.clearSearch}
              />
            </div>
          </CardContent>
        </Card>

        <PropertyMapCanvas
          locations={mapState.locations}
          mapTarget={mapState.mapTarget}
          mapResetKey={mapState.mapResetKey}
          onViewHistory={mapState.viewHistory}
          onDelete={mapState.deleteLocation}
          deletingId={mapState.deletingId}
          loading={mapState.locationsLoading}
        />

        <PropertyHistoryDialog
          property={mapState.selectedProperty}
          open={mapState.historyOpen}
          onOpenChange={mapState.closeHistory}
          loading={mapState.historyLoading}
          error={mapState.historyError}
          onDeleteValuation={mapState.deleteValuation}
        />
      </div>
    </div>
  );
}
