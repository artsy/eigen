import {
  ReloadIcon,
  Flex,
  Box,
  BoxProps,
  useColor,
  Text,
  Touchable,
  BackButton,
} from "@artsy/palette-mobile"
import * as Sentry from "@sentry/react-native"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { debounce } from "lodash"
import { useEffect, useRef, useState } from "react"
import { Animated, Easing } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { space } from "styled-system"
import { JustifyContentValue } from "./Bidding/Elements/types"

interface LoadFailureViewProps {
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

  const trackLoadFailureView = (error: Error | undefined) => {
    const shouldTrackError = !__DEV__ && !isStaging && trackErrorBoundary
    if (shouldTrackError) {
      Sentry.withScope((scope) => {
        scope.setExtra("user-id", userId)
        if (error) {
          scope.setExtra("error", error)
        }
        Sentry.captureMessage("Unable to load in tab: " + activeTab, "error")
      })
    }
  }

  useEffect(() => {
    trackLoadFailureView(error)
  }, [error])

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
            <BackButton
              onPress={goBack}
              showX={showCloseButton}
              hitSlop={{
                top: space(2),
                left: space(2),
                right: space(2),
                bottom: space(2),
              }}
            />
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
            onPress={debounce(() => {
              if (!isAnimating) {
                playAnimation()
              }
              onRetry?.()
            })}
            underlayColor={color("black5")}
            haptic
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              borderColor: color("black10"),
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
