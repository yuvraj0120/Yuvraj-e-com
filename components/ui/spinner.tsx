import type { ComponentProps } from "react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { HugeIcon } from "@/components/ui/huge-icon"

function Spinner({ className, ...props }: Omit<ComponentProps<typeof HugeIcon>, "icon">) {
  return (
    <HugeIcon
      icon={Loading03Icon}
      size={16}
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
