"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { RATLAM_CENTER, DEFAULT_MAP_ZOOM, SEARCH_MAP_ZOOM } from "./constants";

export function RecenterButton() {
  const map = useMap();

  return (
    <button
      type="button"
      onClick={() => map.setView(RATLAM_CENTER, DEFAULT_MAP_ZOOM, { animate: true })}
      className="absolute bottom-4 left-4 z-1000 rounded-md bg-white px-3 py-2 text-sm font-medium shadow-md transition hover:bg-gray-100"
    >
      <span className="sm:hidden">⌖</span>
      <span className="hidden sm:inline">Recenter</span>
    </button>
  );
}

export function SearchMapController({ mapTarget, mapResetKey }) {
  const map = useMap();

  useEffect(() => {
    if (mapTarget?.coordinates) {
      map.setView(mapTarget.coordinates, SEARCH_MAP_ZOOM, { animate: true });
    }
  }, [mapTarget, map]);

  useEffect(() => {
    if (mapResetKey > 0) {
      map.setView(RATLAM_CENTER, DEFAULT_MAP_ZOOM, { animate: true });
    }
  }, [mapResetKey, map]);

  return null;
}
