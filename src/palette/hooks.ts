import { useTheme } from "./Theme"

export const useColor = () => useTheme().color
export const useSpace = () => useTheme().space

/** Returns a config specific to the current theme. */
export const useThemeConfig = <T, U>({ v2, v3 }: { v2: T; v3: U }): U | T => {
  const { theme = { id: "v3" } } = useTheme()
  return theme.id === "v2" ? v2 : v3
}
