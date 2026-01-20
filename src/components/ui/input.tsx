import * as React from "react";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";

interface InputProps extends React.ComponentProps<"input"> {
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onClear, value, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          value={value}
          className={cn(
            "block h-10 w-full rounded-md bg-mainCardV1 dark:bg-darkBorderV1 px-3 py-1 text-base transition-colors file:border-0 file:bg-mainCardV1 file:text-sm file:font-semibold file:text-foreground focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-gray-700/50 border border-lightBorderV1 dark:border-darkBorderV1 dark:text-neutral-200 focus:border-mainTextHoverV1",
            (type === "datetime-local" || type === "date") &&
              "[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-0 [&::-webkit-datetime-edit]:w-full",
            onClear && value && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        {onClear && value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-neutral-200 hover:text-red-500 transition-colors"
            type="button"
          >
            <IconX className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
