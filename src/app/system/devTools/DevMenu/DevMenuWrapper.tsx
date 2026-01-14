import { Flex } from "@artsy/palette-mobile"
import { GlobalStore } from "app/store/GlobalStore"
import { navigateToDevMenu } from "app/system/devTools/DevMenu/utils/navigateToDevMenu"
// eslint-disable-next-line no-restricted-imports
import React, { useCallback, useRef } from "react"
import { Platform } from "react-native"

const MAX_DURATION_BETWEEN_TAPS = 300
// No human can tap faster than that
const MIN_DURATION_BETWEEN_TAPS = 70

export const DevMenuWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const userIsDev = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev.value)
  const isDeepZoomModalVisible = GlobalStore.useAppState(
    (store) => store.devicePrefs.sessionState.isDeepZoomModalVisible
  )
  const gestureState = useRef({ lastTapTimestamp: 0, numTaps: 0 })

  if (Platform.OS === "ios") {
    return <Flex flex={1}>{children}</Flex>
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleStartShouldSetResponderCapture = useCallback(() => {
    const now = Date.now()
    const state = gestureState.current

    if (
      now - state.lastTapTimestamp < MAX_DURATION_BETWEEN_TAPS &&
      // We need to set a minimum duration between taps to avoid triggering the dev menu on mouse scroll
      now - state.lastTapTimestamp > MIN_DURATION_BETWEEN_TAPS
    ) {
      state.numTaps += 1
    } else {
      state.numTaps = 1
    }

    state.lastTapTimestamp = now

    if (state.numTaps >= 5 && !isDeepZoomModalVisible) {
      state.numTaps = 0

      navigateToDevMenu()
    }
    return false
  }, [isDeepZoomModalVisible])

  if (!userIsDev) {
    return <Flex flex={1}>{children}</Flex>
  }

  return (
    <Flex flex={1} onStartShouldSetResponderCapture={handleStartShouldSetResponderCapture}>
      {children}
    </Flex>
  )
}
