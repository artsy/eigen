import { ClassTheme, useTheme } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export const ThemeAwareClassTheme = ({
  children,
}: {
  children: React.ReactNode | ((helpers: ReturnType<typeof useTheme>) => React.ReactNode)
}) => {
  const supportDarkMode = useFeatureFlag("ARDarkModeSupport")
  const darkMode = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  return (
    // @ts-expect-error
    <ClassTheme theme={supportDarkMode ? (darkMode === "dark" ? "v3dark" : "v3light") : undefined}>
      {typeof children === "function" ? children : children}
    </ClassTheme>
  )
}
