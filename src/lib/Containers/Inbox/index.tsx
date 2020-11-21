import { getCurrentEmissionState } from "lib/store/AppStore"
import React from "react"
import { InboxQueryRenderer } from "./Inbox"
import { InboxOldQueryRenderer } from "./InboxOld"

/**
 * A wrapper containing the logic for whether to display our new inbox
 */
export const InboxWrapper: React.FC = () => {
  const shouldDisplayMyBids = getCurrentEmissionState().options.AROptionsBidManagement

  return shouldDisplayMyBids ? <InboxQueryRenderer /> : <InboxOldQueryRenderer />
}
