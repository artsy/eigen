import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { InboxWrapper } from "../Inbox"
import { InboxQueryRenderer } from "../Inbox/Inbox"
import { InboxOldQueryRenderer } from "../Inbox/InboxOld"

jest.mock("lib/Containers/Inbox/Inbox", () => ({
  InboxQueryRenderer: () => "(The InboxQueryRenderer)",
}))
jest.mock("lib/Containers/Inbox/InboxOld", () => ({
  InboxOldQueryRenderer: () => "(The InboxOldQueryRenderer)",
}))

describe("InboxWrapper", () => {
  it("shows the OldInbox if the AROptionsBidManagement flag is not set", () => {
    const tree = renderWithWrappers(<InboxWrapper />)
    expect(tree.root.findAllByType(InboxOldQueryRenderer).length).toEqual(1)
    expect(tree.root.findAllByType(InboxQueryRenderer).length).toEqual(0)
  })

  it("shows the Inbox if the flag is set", () => {
    __globalStoreTestUtils__?.injectEmissionOptions({ AROptionsBidManagement: true })
    const tree = renderWithWrappers(<InboxWrapper />)
    expect(tree.root.findAllByType(InboxOldQueryRenderer).length).toEqual(0)
    expect(tree.root.findAllByType(InboxQueryRenderer).length).toEqual(1)
  })
})
