import MapPageClient from "./map/MapPageClient";
import AuthControls from "@/components/AuthControls";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            ValueMap
          </h1>

          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            ValueMap is a location-based property valuation platform that helps users map, record, and track property values across different areas. Users can add valuations using latitude and longitude, view nearby property rates on an interactive map, and explore historical valuation data to understand how property values change over time.
          </p>
        </div>
        <AuthControls />
      </header>
      <MapPageClient />
      <footer className="border-t bg-white mt-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-left">
          <p>
            © 2026 ValueMap. All rights reserved.
          </p>

          <p>
            Created & developed by{" "}
            <span className="font-medium text-foreground">
              Anurag Dubey
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
