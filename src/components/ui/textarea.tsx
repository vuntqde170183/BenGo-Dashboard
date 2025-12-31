import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-lightBorderV1 dark:border-darkBorderV1 bg-mainCardV1 dark:bg-darkBorderV1 px-3 py-2 text-base dark:text-neutral-200 placeholder:text-muted-foreground focus-visible:outline-none focus:ring-gray-700/50 focus:border-mainTextHoverV1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
