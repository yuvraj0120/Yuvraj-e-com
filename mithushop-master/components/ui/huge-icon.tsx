import type { ComponentProps } from "react"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { cn } from "@/lib/utils"

export type HugeIconProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon"> & {
  icon: IconSvgElement
}

export function HugeIcon({
  icon,
  className,
  size = 16,
  strokeWidth = 1.5,
  ...props
}: HugeIconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      color="currentColor"
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}
