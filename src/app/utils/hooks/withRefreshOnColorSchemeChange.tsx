// This is a wrapper that will refresh the component when the color scheme changes.
// It is useful when you want to refresh the component when the color scheme changes.
// For example, if you want to refresh the component when the color scheme changes, you can use this wrapper.

import { GlobalStore } from "app/store/GlobalStore"

export const withRefreshOnColorSchemeChange = <T extends Object>(
  Component: React.ComponentType<T>
) => {
  return (props: T) => {
    const { colorScheme } = GlobalStore.useAppState((state) => state.devicePrefs)

    return <Component {...props} key={colorScheme} />
  }
}
