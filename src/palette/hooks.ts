import { useTheme } from "./Theme"

export const useColor = () => useTheme().color
export const useSpace = () => useTheme().space

/** Returns a config specific to the current theme. */
export const useThemeConfig = <T, U>({ v3 }: { v3: U }): U | T => {
  // const { theme = { id: "v2" } } = useTheme()
  return v3
}
