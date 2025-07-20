import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const widthClass = React.useMemo(() => {
      const clampedValue = Math.min(100, Math.max(0, value))
      if (clampedValue === 0) return "w-0"
      if (clampedValue <= 12.5) return "w-1/8"
      if (clampedValue <= 25) return "w-1/4"
      if (clampedValue <= 37.5) return "w-3/8"
      if (clampedValue <= 50) return "w-1/2"
      if (clampedValue <= 62.5) return "w-5/8"
      if (clampedValue <= 75) return "w-3/4"
      if (clampedValue <= 87.5) return "w-7/8"
      return "w-full"
    }, [value])

    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full bg-blue-600 transition-all duration-300 ease-in-out",
            widthClass
          )}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
