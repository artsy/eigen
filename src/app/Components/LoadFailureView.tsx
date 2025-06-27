import {
  BackButton,
  Box,
  BoxProps,
  DEFAULT_HIT_SLOP,
  Flex,
  ReloadIcon,
  Text,
  Touchable,
  useColor,
} from "@artsy/palette-mobile"
import * as Sentry from "@sentry/react-native"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { debounce } from "lodash"
import { useEffect, useRef, useState } from "react"
import { Animated, Easing } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { JustifyContentValue } from "./Bidding/Elements/types"

export interface LoadFailureViewProps {
  error?: Error
  onRetry?: (() => void) | null
  justifyContent?: JustifyContentValue
  trackErrorBoundary?: boolean
  showBackButton?: boolean
  showCloseButton?: boolean
  useSafeArea?: boolean
}

const HEADER_HEIGHT = 50

export const LoadFailureView: React.FC<LoadFailureViewProps & BoxProps> = ({
  error,
  onRetry,
  trackErrorBoundary = true,
  showBackButton = false,
  showCloseButton = false,
  useSafeArea = true,
  ...restProps
}) => {
  const color = useColor()
  const spinAnimation = useRef(new Animated.Value(0)).current
  const [isAnimating, setIsAnimating] = useState(false)
  const userId = GlobalStore.useAppState((state) => state.auth.userID)
  const activeTab = GlobalStore.useAppState((state) => state.bottomTabs.sessionState.selectedTab)
  const showErrorInLoadFailureViewToggle = useDevToggle("DTShowErrorInLoadFailureView")
  const safeAreaInset = useSafeAreaInsets()
  const topInsets = useSafeArea ? safeAreaInset.top : 0

  const isStaging = useIsStaging()

  const showErrorMessage = __DEV__ || isStaging || showErrorInLoadFailureViewToggle

  const trackLoadFailureView = (error: Error | undefined, routeParams: any) => {
    const shouldTrackError = !__DEV__ && !isStaging && trackErrorBoundary
    if (shouldTrackError) {
      Sentry.withScope((scope) => {
        scope.setExtra("user-id", userId)
        scope.setExtra("activeTab", activeTab)
        if (error) {
          scope.setExtra("error-details", error)
        }

        if (routeParams) {
          scope.setExtra("routeParams", JSON.stringify(routeParams))
        }

        const moduleName = routeParams?.moduleName
        let message = "Unable to load in tab: " + activeTab
        if (!!moduleName) {
          message = "Unable to load in screen: " + moduleName
        }

        Sentry.captureMessage(message, "error")
      })
    }
  }

  useEffect(() => {
    const routeParams = internal_navigationRef?.current?.getCurrentRoute()?.params

    trackLoadFailureView(error, routeParams)
  }, [error, internal_navigationRef?.current?.getCurrentRoute()?.params])

  const playAnimation = () => {
    setIsAnimating(true)
    Animated.loop(
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start()
  }

  const showTopButton = !!showBackButton || !!showCloseButton

  return (
    <>
      {!!showTopButton && (
        <Flex pt={`${topInsets}px`} mx={2} mb={2} height={HEADER_HEIGHT}>
          <Flex flexDirection="row" justifyContent="space-between" height={30} mb={1}>
            <BackButton onPress={goBack} showX={showCloseButton} hitSlop={DEFAULT_HIT_SLOP} />
          </Flex>
        </Flex>
      )}
      <Flex flex={1} alignItems="center" justifyContent="center" {...restProps}>
        <Text variant="lg-display">Unable to load</Text>
        <Text variant="sm-display" mb={1}>
          Please try again
        </Text>
        {!!isStaging && <Box mb={1} border={2} width={200} borderColor="devpurple" />}

        {!!onRetry && (
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Retry"
            accessibilityHint="Reloads the current screen"
            onPress={debounce(() => {
              if (!isAnimating) {
                playAnimation()
              }
              onRetry?.()
            })}
            underlayColor={color("mono5")}
            haptic
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              borderColor: color("mono10"),
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={{
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                transform: [
                  {
                    rotate: spinAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            >
              <ReloadIcon height={25} width={25} />
            </Animated.View>
          </Touchable>
        )}
        {!!showErrorMessage && (
          <Flex m={2}>
            <Text>Error: {error?.message}</Text>
          </Flex>
        )}
        {!!(trackErrorBoundary && __DEV__) && (
          <Flex m={2}>
            <Text color="red">
              This is marked as a tracked major error boundary. If this is being handled correctly
              pass trackErrorBoundary=false to the LoadFailureView. Handled correctly means: 1)
              local to the screen 2) navigation is accessible. If not, please add error handling to
              originating screen.
            </Text>
          </Flex>
        )}
      </Flex>
    </>
  )
}
