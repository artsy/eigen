import { GlobalStore } from "app/store/GlobalStore"
import { Flex } from "palette"
import React, { useRef, useState } from "react"
import { AdminMenu } from "./AdminMenu"

export const AdminMenuWrapper: React.FC = ({ children }) => {
  const userIsDev = GlobalStore.useAppState((store) => store.artsyPrefs.userIsDev.value)
  const [isShowingAdminMenu, setIsShowingAdminMenu] = useState(false)
  const gestureState = useRef({ lastTapTimestamp: 0, numTaps: 0 })

  if (!userIsDev) {
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
          setIsShowingAdminMenu(true)
        }
        return false
      }}
    >
      {children}
      {!!isShowingAdminMenu && <AdminMenu onClose={() => setIsShowingAdminMenu(false)} />}
    </Flex>
  )
}
