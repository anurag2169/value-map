"use client";

import { useCallback, useEffect, useState } from "react";

import { getCurrentDateValue, resolveDateInput } from "@/lib/date.js";

const EMPTY_FORM = {
  name: "",
  coordinates: "",
  rate: "",
  date: getCurrentDateValue(),
};

function formatLocation(location) {
  return {
    id: location.id,
    name: location.name,
    lat: Number(location.latitude),
    lng: Number(location.longitude),
    rate: Number(location.rate),
    date: location.valuationDate,
  };
}

export default function useValueMap() {
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [mapTarget, setMapTarget] = useState(null);
  const [mapResetKey, setMapResetKey] = useState(0);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const fetchLocations = useCallback(async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLocationsLoading(true);

      const response = await fetch("/api/properties");
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to fetch properties");
      }

      setLocations((result.data || []).map(formatLocation));
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      throw error;
    } finally {
      if (showLoading) setLocationsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLocations().catch(() => {
      // The error is logged in fetchLocations; the UI stops loading.
    });
  }, [fetchLocations]);

  const updateFormField = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }, []);

  const addValuation = useCallback(async (event) => {
    event.preventDefault();

    const parts = formData.coordinates.split(",");
    const lat = Number(parts[0]?.trim());
    const lng = Number(parts[1]?.trim());

    if (
      parts.length !== 2 ||
      !parts[0]?.trim() ||
      !parts[1]?.trim() ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 || lat > 90 ||
      lng < -180 || lng > 180
    ) {
      alert("Please enter valid coordinates like: 23.3315, 75.0367");
      return;
    }

    const rate = Number(formData.rate);
    const valuationDate = resolveDateInput(formData.date);

    if (!formData.name.trim() || !formData.rate || !Number.isFinite(rate) || rate < 0) {
      alert("Please enter a location name and a valid rate.");
      return;
    }

    if (!valuationDate) {
      alert("Please select a valid valuation date.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/valuations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          latitude: lat,
          longitude: lng,
          rate,
          valuationDate,
        }),
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to create valuation");
      }

      await fetchLocations({ showLoading: false });
      setFormData(EMPTY_FORM);
    } catch (error) {
      console.error("Failed to create valuation:", error);
      alert(error.message || "Failed to save valuation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [formData, fetchLocations]);

  const deleteLocation = useCallback(async (id) => {
    try {
      setDeletingId(id);

      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to remove property");
      }

      setLocations((current) => current.filter((location) => location.id !== id));
    } catch (error) {
      console.error("Failed to remove property:", error);
      alert(error.message || "Failed to remove property. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }, []);

  const viewHistory = useCallback(async (propertyId) => {
    setHistoryOpen(true);
    setHistoryLoading(true);
    setHistoryError("");
    setSelectedProperty(null);

    try {
      const response = await fetch(`/api/properties/${propertyId}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch property history");
      }

      setSelectedProperty(result.data);
    } catch (error) {
      console.error("Failed to fetch property history:", error);
      setHistoryError(error.message || "Could not load property history.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const deleteValuation = useCallback(async (valuationId, propertyId) => {
    if (!propertyId || !valuationId) return;

    try {
      const response = await fetch(`/api/valuations/${valuationId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to delete valuation");
      }

      await fetchLocations({ showLoading: false });
      await viewHistory(propertyId);
    } catch (error) {
      console.error("Failed to delete valuation:", error);
      alert(error.message || "Failed to delete valuation. Please try again.");
    }
  }, [fetchLocations, viewHistory]);

  const closeHistory = useCallback((open) => {
    setHistoryOpen(open);
    if (!open) {
      setSelectedProperty(null);
      setHistoryError("");
    }
  }, []);

  const searchCoordinates = useCallback((coordinates) => {
    setMapTarget({ coordinates, key: Date.now() });
  }, []);

  const searchLocation = useCallback((coordinates) => {
    setMapTarget({ coordinates, key: Date.now() });
  }, []);

  const clearSearch = useCallback(() => {
    setMapTarget(null);
    setMapResetKey((key) => key + 1);
  }, []);

  return {
    locations,
    locationsLoading,
    submitting,
    deletingId,
    formData,
    updateFormField,
    addValuation,
    deleteLocation,
    fetchLocations,
    mapTarget,
    mapResetKey,
    searchCoordinates,
    searchLocation,
    clearSearch,
    historyOpen,
    selectedProperty,
    historyLoading,
    historyError,
    viewHistory,
    deleteValuation,
    closeHistory,
  };
}
