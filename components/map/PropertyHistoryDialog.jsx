"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PropertyHistoryDialog({
  property,
  open,
  onOpenChange,
  loading,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[calc(100%-24px)] overflow-y-auto sm:max-w-lg">
        {loading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading valuation history...
          </div>
        ) : !property ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No property selected.
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {property.property?.name || "Property"}
              </DialogTitle>

              <DialogDescription>
                Property valuation history
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              {/* Current Rate */}
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="text-sm text-muted-foreground">
                  Current Rate
                </div>

                <div className="mt-1 text-2xl font-bold">
                  ₹
                  {property.valuations?.length > 0
                    ? property.valuations[
                        property.valuations.length - 1
                      ].rate.toLocaleString("en-IN")
                    : "N/A"}

                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    / sq.ft
                  </span>
                </div>
              </div>

              {/* History */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">
                  Valuation History
                </h3>

                {property.valuations?.length > 0 ? (
                  <div className="space-y-3">
                    {[...property.valuations]
                      .reverse()
                      .map((valuation) => (
                        <div
                          key={valuation.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <div className="text-sm font-medium">
                              {valuation.valuationDate}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              Valuation date
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold">
                              ₹
                              {Number(
                                valuation.rate
                              ).toLocaleString("en-IN")}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              / sq.ft
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                    No valuation history available.
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <h3 className="mb-2 text-sm font-semibold">
                  Location
                </h3>

                <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                  <div>
                    Latitude:{" "}
                    <span className="text-foreground">
                      {property.property?.latitude}
                    </span>
                  </div>

                  <div className="mt-1">
                    Longitude:{" "}
                    <span className="text-foreground">
                      {property.property?.longitude}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}