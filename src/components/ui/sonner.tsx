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
          "--normal-bg": "#d1fae5",
          "--normal-text": "#10b981",
          "--normal-border": "#10b981",     
        } as React.CSSProperties
      }
      {...props}
    />

  )
}

export { Toaster }
