import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import { RetryErrorBoundary } from "app/Components/RetryErrorBoundary"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { AppModule } from "app/Navigation/routes"
import { modules } from "app/Navigation/utils/modules"
import { MotiView } from "moti"
import { memo, useEffect } from "react"
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated"

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

    const hideAnimated = useSharedValue(hidesBottomTabsProp)

    const navigation = useNavigation()

    useEffect(() => {
      const unsubscribe = navigation.addListener("blur", () => {
        const nextRoute = internal_navigationRef.current?.getCurrentRoute()?.name

        const nextRoutehidesBottomTabs = !!(
          nextRoute && modules[nextRoute as AppModule]?.options?.hidesBottomTabs
        )

        // We need to remove the bottom padding before leaving the screen
        // So we don't get a blank view covering content when we come back to the screen
        hideAnimated.set(nextRoutehidesBottomTabs)
      })

      return unsubscribe
    }, [])

    const animatedStyles = useAnimatedStyle(() => ({
      flex: 1,
      paddingBottom: hideAnimated.get() ? 0 : tabBarHeight,
    }))

    return (
      <RetryErrorBoundary>
        <MotiView style={animatedStyles}>{children}</MotiView>
      </RetryErrorBoundary>
    )
  }
)
