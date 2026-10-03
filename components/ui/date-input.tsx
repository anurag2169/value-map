import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "cn";

const DateInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      type="date"
      className={cn(
        "h-9 min-h-0 rounded-md border border-input bg-input/20 px-2 py-0 text-sm text-foreground",
        className
      )}
      {...props}
    />
  )
);

DateInput.displayName = "DateInput";

export { DateInput };
