"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

function parseCoordinates(value) {
  const parts = value.split(",");
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) return null;

  const lat = Number(parts[0].trim());
  const lng = Number(parts[1].trim());

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 || lat > 90 ||
    lng < -180 || lng > 180
  ) return null;

  return [lat, lng];
}

export default function MapSearch({
  locations,
  onSearchCoordinates,
  onSearchLocation,
  onClear,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchValue = query.trim();
    if (!searchValue) return;

    const coordinates = parseCoordinates(searchValue);
    if (coordinates) {
      setResults([]);
      setSearched(true);
      onSearchCoordinates(coordinates);
      return;
    }

    const localResults = locations
      .filter((location) => location.name.toLowerCase().includes(searchValue.toLowerCase()))
      .map((location) => ({ ...location, source: "saved" }));

    if (localResults.length) {
      setResults(localResults);
      setSearched(true);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      setResults([]);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchValue)}&limit=5`
      );
      if (!response.ok) throw new Error("Location search failed");

      const data = await response.json();
      setResults(data.map((item) => ({
        id: `osm-${item.place_id}`,
        name: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
        source: "osm",
      })));
    } catch (error) {
      console.error("Location search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const selectResult = (location) => {
    setQuery(location.name);
    setResults([]);
    setSearched(false);
    onSearchLocation([location.lat, location.lng]);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    onClear();
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <Input
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            setResults([]);
            setSearched(false);
            if (!value.trim()) onClear();
          }}
          placeholder="Search location or coordinates..."
          className="pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear location search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-2 rounded-md border bg-white px-3 py-3 text-sm text-gray-500 shadow-lg">
          Searching...
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-md border bg-white shadow-lg">
          {results.map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => selectResult(location)}
              className="block w-full border-b px-3 py-3 text-left last:border-b-0 hover:bg-gray-50"
            >
              <div className="text-sm font-medium">{location.name}</div>
              {location.source === "osm" ? (
                <div className="mt-1 text-xs text-gray-500">OpenStreetMap</div>
              ) : (
                <div className="mt-1 text-xs text-gray-500">
                  ₹{Number(location.rate).toLocaleString("en-IN")} / sq.ft
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && !parseCoordinates(query) && (
        <div className="mt-2 rounded-md border bg-white px-3 py-3 text-sm text-gray-500 shadow-lg">
          No location found
        </div>
      )}
    </form>
  );
}
