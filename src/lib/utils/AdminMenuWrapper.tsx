import React, { useRef, useState } from "react"
import { View } from "react-native"
import { AdminMenu } from "./AdminMenu"

export const AdminMenuWrapper: React.FC = ({ children }) => {
  const [isShowingAdminMenu, setIsShowingAdminMenu] = useState(false)
  const gestureState = useRef({ lastTapTimestamp: 0, numTaps: 0 })
  // TODO: if public release, just return <>{children}</>
  return (
    <View
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
          setIsShowingAdminMenu(true)
        }
        return false
      }}
      style={{ flex: 1 }}
    >
      {children}
      {!!isShowingAdminMenu && <AdminMenu onClose={() => setIsShowingAdminMenu(false)} />}
    </View>
  )
}
