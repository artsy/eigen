import { NotificationsManager } from "lib/NativeModules/NotificationsManager"
import { __globalStoreTestUtils__ } from "../GlobalStore"
import { NativeEvent } from "../NativeModel"

beforeEach(() => {
  __globalStoreTestUtils__?.reset()
})

describe("NativeModel", () => {
  it(`triggers a fetch of the current unreadMessagesCount when a notification is received`, () => {
    expect(__globalStoreTestUtils__?.getLastAction()?.type ?? "").not.toContain("fetchCurrentUnreadConversationCount")
    NotificationsManager.emit("event", {
      type: "NOTIFICATION_RECEIVED",
    } as NativeEvent)
    expect(__globalStoreTestUtils__?.getLastAction().type).toContain("fetchCurrentUnreadConversationCount")
  })
})
