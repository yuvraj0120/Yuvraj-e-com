"use client"

import {
  AlertDiamondIcon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { HugeIcon } from "@/components/ui/huge-icon"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <HugeIcon icon={CheckmarkCircle02Icon} size={16} />,
        info: <HugeIcon icon={InformationCircleIcon} size={16} />,
        warning: <HugeIcon icon={AlertDiamondIcon} size={16} />,
        error: <HugeIcon icon={CancelCircleIcon} size={16} />,
        loading: (
          <HugeIcon
            icon={Loading03Icon}
            size={16}
            className="animate-spin"
          />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
