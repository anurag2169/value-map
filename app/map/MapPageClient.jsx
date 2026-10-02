"use client";

import dynamic from "next/dynamic";

const ValueMap = dynamic(
  () => import("@/components/map-ui/ValueMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-125 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading ValueMap...
        </p>
      </div>
    ),
  }
);

// const ValueMap = dynamic(
//   () => import("@/components/map/ValueMap"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex min-h-125 items-center justify-center">
//         <p className="text-sm text-muted-foreground">
//           Loading ValueMap...
//         </p>
//       </div>
//     ),
//   }
// );

export default function MapPageClient() {
  return <ValueMap />;
}