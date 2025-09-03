import { Flex } from "@artsy/palette-mobile"
import { __unsafe__onboardingNavigationRef } from "app/Scenes/Onboarding/Onboarding"
import { GlobalStore } from "app/store/GlobalStore"
// eslint-disable-next-line no-restricted-imports
import { navigate } from "app/system/navigation/navigate"
import React, { useRef } from "react"
import { Platform } from "react-native"

const MAX_DURATION_BETWEEN_TAPS = 300

export const DevMenuWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const userIsDev = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev.value)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isDeepZoomModalVisible = GlobalStore.useAppState(
    (store) => store.devicePrefs.sessionState.isDeepZoomModalVisible
  )
  const gestureState = useRef({ lastTapTimestamp: 0, numTaps: 0 })

  if (!userIsDev || Platform.OS === "ios") {
    return <Flex flex={1}>{children}</Flex>
  }

  return (
    <Flex
      flex={1}
      onStartShouldSetResponderCapture={() => {
        const now = Date.now()
        const state = gestureState.current

        if (now - state.lastTapTimestamp < MAX_DURATION_BETWEEN_TAPS) {
          state.numTaps += 1
        } else {
          state.numTaps = 1
        }

        state.lastTapTimestamp = now

        if (state.numTaps >= 5 && !isDeepZoomModalVisible) {
          state.numTaps = 0

          if (!isLoggedIn) {
            __unsafe__onboardingNavigationRef.current?.navigate("DevMenu")
          } else {
            navigate("/dev-menu")
          }
        }
        return false
      }}
    >
      {children}
    </Flex>
  )
}
