"use client";

import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PropertyHistoryDialog from "./PropertyHistoryDialog";

function RecenterButton() {
    const map = useMap();

    const handleRecenter = () => {
        map.setView(ratlamCenter, 14, {
            animate: true,
        });
    };

    return (
        <button
            type="button"
            onClick={handleRecenter}
            className="absolute bottom-4 left-4 z-[1000] rounded-md bg-white px-3 py-2 text-sm font-medium shadow-md transition hover:bg-gray-100"
        >
            <span className="sm:hidden">⌖</span>
            <span className="hidden sm:inline">Recenter</span>
        </button>
    );
}

function MapSearch({
    locations,
    onSearchCoordinates,
    onSearchLocation,
    onClear,
}) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const isCoordinates = (value) => {
        const parts = value
            .split(",")
            .map((item) => Number(item.trim()));

        if (parts.length !== 2) {
            return null;
        }

        const [lat, lng] = parts;

        if (
            Number.isNaN(lat) ||
            Number.isNaN(lng) ||
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
        ) {
            return null;
        }

        return [lat, lng];
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        const searchValue = query.trim();

        if (!searchValue) {
            return;
        }

        // 1. Search coordinates directly
        const coordinates = isCoordinates(searchValue);

        if (coordinates) {
            setResults([]);

            onSearchCoordinates(coordinates);

            return;
        }

        // 2. Search saved locations
        const localResults = locations.filter((location) =>
            location.name
                .toLowerCase()
                .includes(searchValue.toLowerCase())
        );

        if (localResults.length > 0) {
            setResults(localResults);
            return;
        }

        // 3. Search OpenStreetMap
        try {
            setLoading(true);
            setResults([]);

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
                    searchValue
                )}&limit=5`
            );

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();

            const osmResults = data.map((item) => ({
                id: `osm-${item.place_id}`,
                name: item.display_name,
                lat: Number(item.lat),
                lng: Number(item.lon),
                source: "osm",
            }));

            setResults(osmResults);
        } catch (error) {
            console.error(
                "Location search failed:",
                error
            );

            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (location) => {
        setQuery(location.name);
        setResults([]);

        onSearchLocation([
            location.lat,
            location.lng,
        ]);
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
        setLoading(false);

        onClear();
    };

    return (
        <form
            onSubmit={handleSearch}
            className="w-full"
        >
            <div className="relative">
                <Input
                    value={query}
                    onChange={(event) => {
                        const value =
                            event.target.value;

                        setQuery(value);

                        if (!value.trim()) {
                            setResults([]);
                            onClear();
                        }
                    }}
                    placeholder="Search location or coordinates..."
                    className="pr-10"
                />

                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
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
                            onClick={() =>
                                handleSelect(location)
                            }
                            className="block w-full border-b px-3 py-3 text-left last:border-b-0 hover:bg-gray-50"
                        >
                            <div className="text-sm font-medium">
                                {location.name}
                            </div>

                            {location.source ===
                                "osm" ? (
                                <div className="mt-1 text-xs text-gray-500">
                                    OpenStreetMap
                                </div>
                            ) : (
                                <div className="mt-1 text-xs text-gray-500">
                                    ₹
                                    {location.rate.toLocaleString(
                                        "en-IN"
                                    )}{" "}
                                    / sq.ft
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {!loading &&
                query.trim() &&
                results.length === 0 &&
                !isCoordinates(query) && (
                    <div className="mt-2 rounded-md border bg-white px-3 py-3 text-sm text-gray-500 shadow-lg">
                        No location found
                    </div>
                )}
        </form>
    );
}

function SearchMapController({
    searchCoordinates,
    searchLocation,
    resetSearch,
}) {
    const map = useMap();

    useEffect(() => {
        if (searchCoordinates) {
            map.setView(
                searchCoordinates,
                16,
                {
                    animate: true,
                }
            );
        }
    }, [searchCoordinates, map]);

    useEffect(() => {
        if (searchLocation) {
            map.setView(
                searchLocation,
                16,
                {
                    animate: true,
                }
            );
        }
    }, [searchLocation, map]);

    useEffect(() => {
        if (resetSearch) {
            map.setView(
                ratlamCenter,
                14,
                {
                    animate: true,
                }
            );
        }
    }, [resetSearch, map]);

    return null;
}

// --------------------------------------------------
// Marker Icons
// --------------------------------------------------

const createMarkerIcon = (color) => {
    return L.divIcon({
        className: "",
        html: `
      <div
        style="
          width: 20px;
          height: 20px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        "
      ></div>
    `,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
        popupAnchor: [0, -20],
    });
};

const lowRateIcon = createMarkerIcon("#2563eb");
const mediumRateIcon = createMarkerIcon("#16a34a");
const highRateIcon = createMarkerIcon("#dc2626");

const ratlamCenter = [23.3315, 75.0367];


export default function ValueMap() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        coordinates: "",
        rate: "",
    });
    const [searchCoordinates, setSearchCoordinates] =
        useState(null);

    const [searchLocation, setSearchLocation] =
        useState(null);

    const [resetSearch, setResetSearch] =
        useState(false);

    const [historyOpen, setHistoryOpen] =
        useState(false);

    const [selectedProperty, setSelectedProperty] =
        useState(null);

    const [historyLoading, setHistoryLoading] =
        useState(false);


    const handleSearchCoordinates = (coordinates) => {
        setSearchCoordinates(coordinates);
        setSearchLocation(null);
        setResetSearch(false);
    };

    const handleSearchLocation = (coordinates) => {
        setSearchLocation(coordinates);
        setSearchCoordinates(null);
        setResetSearch(false);
    };

    const handleClearSearch = () => {
        setSearchCoordinates(null);
        setSearchLocation(null);

        setResetSearch((previous) => !previous);
    };

    const fetchLocations = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "/api/properties"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch properties"
                );
            }

            const result = await response.json();

            const formattedLocations = (
                result.data || []
            ).map((location) => ({
                id: location.id,
                name: location.name,
                lat: location.latitude,
                lng: location.longitude,
                rate: location.rate,
                date: location.valuationDate,
            }));

            setLocations(formattedLocations);
        } catch (error) {
            console.error(
                "Failed to fetch locations:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const [lat, lng] = formData.coordinates
            .split(",")
            .map((value) => Number(value.trim()));

        if (
            Number.isNaN(lat) ||
            Number.isNaN(lng) ||
            lat < -90 ||
            lat > 90 ||
            lng < -180 ||
            lng > 180
        ) {
            alert(
                "Please enter valid coordinates like: 23.3315, 75.0367"
            );
            return;
        }

        if (
            !formData.name.trim() ||
            !formData.rate
        ) {
            alert(
                "Please enter location name and rate"
            );
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(
                "/api/valuations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        latitude: lat,
                        longitude: lng,
                        rate: Number(formData.rate),
                        valuationDate: new Date()
                            .toISOString()
                            .split("T")[0],
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to create valuation"
                );
            }

            await fetchLocations();

            setFormData({
                name: "",
                coordinates: "",
                rate: "",
            });
        } catch (error) {
            console.error(
                "Failed to create valuation:",
                error
            );

            alert(
                "Failed to save valuation. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // --------------------------------------------------
    // Marker Color
    // --------------------------------------------------

    const getMarkerIcon = (rate) => {
        if (rate < 4500) {
            return lowRateIcon;
        }

        if (rate <= 5500) {
            return mediumRateIcon;
        }

        return highRateIcon;
    };

    // --------------------------------------------------
    // Rate Label
    // --------------------------------------------------

    const getRateLevel = (rate) => {
        if (rate < 4500) {
            return {
                label: "Low",
                className:
                    "border-blue-200 bg-blue-50 text-blue-700",
            };
        }

        if (rate <= 5500) {
            return {
                label: "Medium",
                className:
                    "border-green-200 bg-green-50 text-green-700",
            };
        }

        return {
            label: "High",
            className:
                "border-red-200 bg-red-50 text-red-700",
        };
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `/api/properties/${id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to remove property"
                );
            }

            setLocations((previous) =>
                previous.filter(
                    (location) => location.id !== id
                )
            );
        } catch (error) {
            console.error(
                "Failed to remove property:",
                error
            );

            alert(
                "Failed to remove property. Please try again."
            );
        }
    };

    const handleViewHistory = async (propertyId) => {
        try {
            setHistoryLoading(true);

            setHistoryOpen(true);

            const response = await fetch(
                `/api/properties/${propertyId}`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch property history"
                );
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Failed to fetch property history"
                );
            }

            setSelectedProperty(result.data);
        } catch (error) {
            console.error(
                "Failed to fetch property history:",
                error
            );

            setSelectedProperty(null);
        } finally {
            setHistoryLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* ---------------------------------------- */}
                {/* Add Location */}
                {/* ---------------------------------------- */}

                <Card>
                    <CardHeader>
                        <CardTitle>Add Property Location</CardTitle>

                        <CardDescription>
                            Add a location using its coordinates and
                            current property rate.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium"
                                >
                                    Location
                                </label>

                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Do Batti"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="coordinates"
                                    className="text-sm font-medium"
                                >
                                    Coordinates
                                </label>

                                <Input
                                    id="coordinates"
                                    name="coordinates"
                                    placeholder="23.3315, 75.0367"
                                    value={formData.coordinates}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="rate"
                                    className="text-sm font-medium"
                                >
                                    Rate / sq.ft
                                </label>

                                <Input
                                    id="rate"
                                    name="rate"
                                    type="number"
                                    min="0"
                                    placeholder="5000"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={submitting}
                                >
                                    {submitting ? "Adding..." : "Add Location"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* ---------------------------------------- */}
                {/* Map */}
                {/* ---------------------------------------- */}

                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Property Valuation Map</CardTitle>

                        <CardDescription>
                            Explore property rates across Ratlam.
                            Marker colors represent the valuation range.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 space-y-3">

                        {/* Search - outside map */}
                        <div className="border-b bg-white p-4 sm:p-5">
                            <div className="w-full max-w-2xl">
                                <div className="mb-3">
                                    <h3 className="text-sm font-semibold sm:text-base">
                                        Search Location
                                    </h3>

                                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                        Search by location name or enter latitude
                                        and longitude coordinates.
                                    </p>
                                </div>

                                <MapSearch
                                    locations={locations}
                                    onSearchCoordinates={
                                        handleSearchCoordinates
                                    }
                                    onSearchLocation={
                                        handleSearchLocation
                                    }
                                    onClear={handleClearSearch}
                                />
                            </div>
                        </div>

                        {/* Map */}
                        <div className="relative h-[500px] sm:h-[600px]">

                            {loading && (
                                <div className="border-b bg-white px-4 py-3 text-sm text-muted-foreground">
                                    Loading property locations...
                                </div>
                            )}

                            <MapContainer
                                center={ratlamCenter}
                                zoom={14}
                                className="h-full w-full"
                            >
                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <RecenterButton />

                                {locations.map((location) => {
                                    const rateLevel =
                                        getRateLevel(location.rate);

                                    return (
                                        <Marker
                                            key={location.id}
                                            position={[
                                                location.lat,
                                                location.lng,
                                            ]}
                                            icon={getMarkerIcon(
                                                location.rate
                                            )}
                                        >
                                            <Popup>
                                                <div className="w-[min(260px,calc(100vw-60px))] space-y-3 p-1">
                                                    <div>
                                                        <div className="text-base font-semibold break-words">
                                                            {location.name}
                                                        </div>

                                                        <div className="mt-1 text-xs text-gray-500">
                                                            Property valuation
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="text-xs text-gray-500">
                                                                Rate
                                                            </div>

                                                            <div className="text-lg font-bold">
                                                                ₹{location.rate.toLocaleString("en-IN")}
                                                                <span className="text-xs font-normal text-gray-500">
                                                                    {" "}
                                                                    / sq.ft
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <span
                                                            className={`shrink-0 rounded-full border px-2 py-1 text-xs font-medium ${rateLevel.className}`}
                                                        >
                                                            {rateLevel.label}
                                                        </span>
                                                    </div>

                                                    <div className="border-t pt-2 text-xs text-gray-500 break-words">
                                                        <div>
                                                            <strong>Updated:</strong> {location.date}
                                                        </div>

                                                        <div>
                                                            <strong>Coordinates:</strong>{" "}
                                                            {location.lat}, {location.lng}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() =>
                                                                handleViewHistory(location.id)
                                                            }
                                                        >
                                                            View History
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() =>
                                                                handleDelete(location.id)
                                                            }
                                                        >
                                                            Remove Marker
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MapContainer>

                            {/* ---------------------------------- */}
                            {/* Map Legend */}
                            {/* ---------------------------------- */}

                            <div className="absolute right-2 top-2 z-[1000]">
                                <Card className="w-[170px] max-w-[calc(100vw-24px)] shadow-lg">
                                    <CardHeader className="p-3 pb-2">
                                        <CardTitle className="text-sm">
                                            Rate Level
                                        </CardTitle>

                                        <CardDescription className="text-xs">
                                            Based on ₹ / sq.ft
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-2 p-3 pt-1">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="h-3 w-3 shrink-0 rounded-full bg-blue-600" />

                                            <span>Low</span>

                                            <span className="ml-auto whitespace-nowrap text-muted-foreground">
                                                &lt; ₹4.5k
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="h-3 w-3 shrink-0 rounded-full bg-green-600" />

                                            <span>Medium</span>

                                            <span className="ml-auto whitespace-nowrap text-muted-foreground">
                                                ₹4.5k–5.5k
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="h-3 w-3 shrink-0 rounded-full bg-red-600" />

                                            <span>High</span>

                                            <span className="ml-auto whitespace-nowrap text-muted-foreground">
                                                &gt; ₹5.5k
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>

                    </CardContent>
                </Card>

                {/* Property History Dialog */}
                <PropertyHistoryDialog
                    property={selectedProperty}
                    open={historyOpen}
                    onOpenChange={(open) => {
                        setHistoryOpen(open);

                        if (!open) {
                            setSelectedProperty(null);
                        }
                    }}
                    loading={historyLoading}
                />

            </div>
        </div>
    );
}