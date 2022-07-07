import { navigate } from "app/navigation/navigate"
import { GlobalStore } from "app/store/GlobalStore"
import { Flex } from "palette"
import React, { useRef } from "react"
import { Platform } from "react-native"

export const AdminMenuWrapper: React.FC = ({ children }) => {
  const userIsDev = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev.value)
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

        if (state.numTaps >= 5) {
          state.numTaps = 0
          navigate("/admin2")
        }
        return false
      }}
    >
      {children}
    </Flex>
  )
}
