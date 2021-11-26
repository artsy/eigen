import { useColorScheme } from "react-native"

// the purpose of this hook is to track the preferred theme of a user
export const usePreferredThemeTracking = () => {
  const colorScheme = useColorScheme()
  console.warn({ colorScheme })
  // track the user's preferred theme
}
