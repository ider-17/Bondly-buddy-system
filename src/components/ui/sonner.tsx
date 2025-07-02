"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#FFFFFF",
          "--normal-text": "#166534",
          "--normal-border": "#166534",
        } as React.CSSProperties
      }
      {...props}
    />

  )
}

export { Toaster }
