import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useFocusEffect } from "@react-navigation/native"
import { RetryErrorBoundary } from "app/Components/RetryErrorBoundary"
import { TAB_BAR_ANIMATION_DURATION } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { AppModule } from "app/Navigation/routes"
import { modules } from "app/Navigation/utils/modules"
import { MotiView } from "moti"
import { memo, useCallback } from "react"
import { Easing, useSharedValue, withTiming } from "react-native-reanimated"

export interface ScreenWrapperProps {
  readonly hidesBottomTabs?: boolean
}

/**
 * This component wraps all screens we have in the app.
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = memo(
  ({ hidesBottomTabs: hidesBottomTabsProp = false, children }) => {
    // We don't have the bottom tabs context on modal screens
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const tabBarHeight = hidesBottomTabsProp ? 0 : useBottomTabBarHeight()

    const hideBottomTabAnimated = useSharedValue(1)

    useFocusEffect(
      useCallback(() => {
        const currentRoute = internal_navigationRef.current?.getCurrentRoute()?.name
        const hidesBottomTabs = !!(
          currentRoute && modules[currentRoute as AppModule]?.options?.hidesBottomTabs
        )

        hideBottomTabAnimated.value = hidesBottomTabs ? 1 : 0
      }, [hideBottomTabAnimated])
    )

    return (
      <RetryErrorBoundary>
        <MotiView
          style={{
            flex: 1,
            paddingBottom: withTiming(hideBottomTabAnimated.value ? 0 : tabBarHeight, {
              duration: TAB_BAR_ANIMATION_DURATION,
              easing: Easing.inOut(Easing.ease),
            }),
          }}
        >
          {children}
        </MotiView>
      </RetryErrorBoundary>
    )
  }
)
