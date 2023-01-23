import { GlobalStore } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { Flex } from "palette"
import React, { useRef } from "react"
import { Platform } from "react-native"

export const DevMenuWrapper: React.FC = ({ children }) => {
  const userIsDev = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev.value)
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

        if (now - state.lastTapTimestamp < 500) {
          state.numTaps += 1
        } else {
          state.numTaps = 1
        }

        state.lastTapTimestamp = now

        if (state.numTaps >= 5 && !isDeepZoomModalVisible) {
          state.numTaps = 0
          navigate("/dev-menu")
        }
        return false
      }}
    >
      {children}
    </Flex>
  )
}
