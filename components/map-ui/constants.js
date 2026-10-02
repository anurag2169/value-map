import L from "leaflet";

export const RATLAM_CENTER = [23.3315, 75.0367];
export const DEFAULT_MAP_ZOOM = 14;
export const SEARCH_MAP_ZOOM = 16;

const createMarkerIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<div style="width:20px;height:20px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
  });

export const RATE_ICONS = {
  low: createMarkerIcon("#2563eb"),
  medium: createMarkerIcon("#16a34a"),
  high: createMarkerIcon("#dc2626"),
};

export function getRateLevel(rate) {
  const numericRate = Number(rate);

  if (numericRate < 4500) {
    return {
      key: "low",
      label: "Low",
      icon: RATE_ICONS.low,
      className: "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  if (numericRate <= 5500) {
    return {
      key: "medium",
      label: "Medium",
      icon: RATE_ICONS.medium,
      className: "border-green-200 bg-green-50 text-green-700",
    };
  }

  return {
    key: "high",
    label: "High",
    icon: RATE_ICONS.high,
    className: "border-red-200 bg-red-50 text-red-700",
  };
}
