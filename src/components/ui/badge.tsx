import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "flex items-center justify-center border px-2 py-1 h-fit rounded-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer text-[13px] h-6 leading-[1px] w-fit text-nowrap",
  {
    variants: {
      variant: {
        default: "border-darkBorderV1 text-darkBorderV1 text-nowrap",
        secondary:
          "border-darkBorderV1 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-neutral-200 text-nowrap",
        destructive:
          "border-darkBorderV1 bg-destructive text-destructive-foreground hover:bg-destructive/80 text-nowrap",
        outline:
          "text-foreground border h-[30px] px-3 !border-white/50 bg-darkBorderV1 text-[#343A40] font-semibold !rounded-none rounded-full text-nowrap",
        orange:
          "bg-orange-600 hover:bg-orange-700 text-neutral-200 border-[2px] border-orange-500 text-nowrap flex items-center gap-1",
        red: "bg-red-600 hover:bg-red-700 text-neutral-200 border-[2px] border-red-500 text-nowrap flex items-center gap-1",
        amber:
          "bg-amber-600 hover:bg-amber-700 text-neutral-200 border-[2px] border-amber-500 text-nowrap flex items-center gap-1",
        yellow:
          "bg-yellow-600 hover:bg-yellow-700 text-neutral-200 border-[2px] border-yellow-500 text-nowrap flex items-center gap-1",
        lime: "bg-lime-600 hover:bg-lime-700 text-neutral-200 border-[2px] border-lime-500 text-nowrap flex items-center gap-1",
        green:
          "bg-green-600 hover:bg-green-700 text-neutral-200 border-[2px] border-green-500 text-nowrap flex items-center gap-1",
        emerald:
          "bg-emerald-600 hover:bg-emerald-700 text-neutral-200 border-[2px] border-emerald-500 text-nowrap flex items-center gap-1",
        teal: "bg-teal-600 hover:bg-teal-700 text-neutral-200 border-[2px] border-teal-500 text-nowrap flex items-center gap-1",
        cyan: "bg-cyan-600 hover:bg-cyan-700 text-neutral-200 border-[2px] border-cyan-500 text-nowrap flex items-center gap-1",
        sky: "bg-sky-600 hover:bg-sky-700 text-neutral-200 border-[2px] border-sky-500 text-nowrap flex items-center gap-1",
        blue: "bg-blue-600 hover:bg-blue-700 text-neutral-200 border-[2px] border-blue-500 text-nowrap flex items-center gap-1",
        indigo:
          "bg-indigo-600 hover:bg-indigo-700 text-neutral-200 border-[2px] border-indigo-500 text-nowrap flex items-center gap-1",
        violet:
          "bg-violet-600 hover:bg-violet-700 text-neutral-200 border-[2px] border-violet-500 text-nowrap flex items-center gap-1",
        purple:
          "bg-purple-600 hover:bg-purple-700 text-neutral-200 border-[2px] border-purple-500 text-nowrap flex items-center gap-1",
        fuchsia:
          "bg-fuchsia-600 hover:bg-fuchsia-700 text-neutral-200 border-[2px] border-fuchsia-500 text-nowrap flex items-center gap-1",
        pink: "bg-pink-600 hover:bg-pink-700 text-neutral-200 border-[2px] border-pink-500 text-nowrap flex items-center gap-1",
        rose: "bg-rose-600 hover:bg-rose-700 text-neutral-200 border-[2px] border-rose-500 text-nowrap flex items-center gap-1",
        slate:
          "bg-slate-600 hover:bg-slate-700 text-neutral-200 border-[2px] border-slate-500 text-nowrap flex items-center gap-1",
        gray: "bg-gray-600 hover:bg-gray-700 text-neutral-200 border-[2px] border-gray-500 text-nowrap flex items-center gap-1",
        zinc: "bg-zinc-600 hover:bg-zinc-700 text-neutral-200 border-[2px] border-zinc-500 text-nowrap flex items-center gap-1",
        neutral:
          "bg-neutral-600 hover:bg-neutral-700 text-neutral-200 border-[2px] border-neutral-500 text-nowrap flex items-center gap-1",
        stone:
          "bg-stone-600 hover:bg-stone-700 text-neutral-200 border-[2px] border-stone-500 text-nowrap flex items-center gap-1",
        ghost:
          "hover:text-neutral-200 border-darkBorderV1 bg-darkBorderV1 text-neutral-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
