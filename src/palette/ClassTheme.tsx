import React from "react"
import { Theme, useTheme } from "./Theme"

export const ClassTheme = ({
  theme = "v3",
  children,
}: {
  theme?: "v3"
  children: React.ReactNode | ((helpers: ReturnType<typeof useTheme>) => React.ReactNode)
}) => {
  const hookStuff = useTheme()
  return (
    <Theme theme={theme}>{typeof children === "function" ? children(hookStuff) : children}</Theme>
  )
}
