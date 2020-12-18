import { getCurrentEmissionState } from "lib/store/GlobalStore"
import React from "react"
import { InboxQueryRenderer } from "./Inbox"
import { InboxOldQueryRenderer } from "./InboxOld"

/**
 * A wrapper containing the logic for whether to display our new inbox
 */
export const InboxWrapper: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const shouldDisplayMyBids = true // getCurrentEmissionState().options.AROptionsBidManagement

  return shouldDisplayMyBids ? (
    <InboxQueryRenderer isVisible={isVisible} />
  ) : (
    <InboxOldQueryRenderer isVisible={isVisible} />
  )
}
