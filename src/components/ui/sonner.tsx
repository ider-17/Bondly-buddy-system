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
          "--normal-bg": "#d1fae5",         // Tailwind green-100
          "--normal-text": "#10b981",       // Tailwind green-500
          "--normal-border": "#10b981",     // Tailwind green-500
        } as React.CSSProperties
      }
      {...props}
    />

  )
}

export { Toaster }
