"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          {...props}
        />
        <label
          className={cn(
            "relative inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            "bg-input data-[state=checked]:bg-primary",
            className
          )}
          data-state={props.checked ? "checked" : "unchecked"}
        >
          <span
            className={cn(
              "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
              "bg-background translate-x-0 data-[state=checked]:translate-x-[calc(100%-2px)]",
              "dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground"
            )}
            data-state={props.checked ? "checked" : "unchecked"}
          />
        </label>
      </div>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
