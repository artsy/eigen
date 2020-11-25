import tokens from "@artsy/palette-tokens"
import React from "react"
import { fontFamily } from "./platform/fonts/fontFamily"
import { ThemeProvider } from "./platform/primitives"

/**
 * All of the config for the Artsy theming system, based on the
 * design system from our design team:
 * https://www.notion.so/artsy/Master-Library-810612339f474d0997fe359af4285c56
 */
export * from "@artsy/palette-tokens"
export const themeProps = {
  ...tokens,
  fontFamily,
}

/**
 * A wrapper component for passing down the Artsy theme context
 */
export const Theme: React.FC<{}> = (props) => {
  return <ThemeProvider theme={themeProps}>{props.children}</ThemeProvider>
}
