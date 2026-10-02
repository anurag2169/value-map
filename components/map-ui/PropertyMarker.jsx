"use client";

import { Marker } from "react-leaflet";
import { getRateLevel } from "./constants";
import MapPopup from "./MapPopup";

export default function PropertyMarker({
  location,
  onViewHistory,
  onDelete,
  deleting,
}) {
  const rateLevel = getRateLevel(location.rate);

  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={rateLevel.icon}
    >
      <MapPopup
        location={location}
        onViewHistory={onViewHistory}
        onDelete={onDelete}
        deleting={deleting}
      />
    </Marker>
  );
}
