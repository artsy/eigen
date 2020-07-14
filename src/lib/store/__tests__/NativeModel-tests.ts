import { NotificationsManager } from "lib/NativeModules/NotificationsManager"
import { __appStoreTestUtils__ } from "../AppStore"
import { NativeEvent } from "../NativeModel"

beforeEach(() => {
  __appStoreTestUtils__?.reset()
})

describe("NativeModel", () => {
  it(`stores the bottom tab state`, async () => {
    expect(__appStoreTestUtils__?.getCurrentState().native.selectedTab).toBe("home")
  })

  it(`responds to native state update events`, () => {
    expect(__appStoreTestUtils__?.getCurrentState().native.selectedTab).toBe("home")
    NotificationsManager.emit("event", {
      type: "STATE_CHANGED",
      payload: {
        selectedTab: "search",
      },
    } as NativeEvent)
    expect(__appStoreTestUtils__?.getCurrentState().native.selectedTab).toBe("search")
  })

  it(`triggers a fetch of the current unreadMessagesCount when a notification is received`, () => {
    expect(__appStoreTestUtils__?.getCurrentState().native.selectedTab).toBe("home")

    expect(__appStoreTestUtils__?.getLastAction()?.type ?? "").not.toContain("fetchCurrentUnreadConversationCount")
    NotificationsManager.emit("event", {
      type: "NOTIFICATION_RECEIVED",
    } as NativeEvent)
    expect(__appStoreTestUtils__?.getLastAction().type).toContain("fetchCurrentUnreadConversationCount")
  })
})
