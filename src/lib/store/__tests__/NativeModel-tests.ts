import { NotificationsManager } from "lib/NativeModules/NotificationsManager"
import { __appStoreTestUtils__ } from "../AppStore"
import { NativeEvent } from "../NativeModel"

beforeEach(() => {
  __appStoreTestUtils__?.reset()
})

describe("NativeModel", () => {
  it(`triggers a fetch of the current unreadMessagesCount when a notification is received`, () => {
    expect(__appStoreTestUtils__?.getLastAction()?.type ?? "").not.toContain("fetchCurrentUnreadConversationCount")
    NotificationsManager.emit("event", {
      type: "NOTIFICATION_RECEIVED",
    } as NativeEvent)
    expect(__appStoreTestUtils__?.getLastAction().type).toContain("fetchCurrentUnreadConversationCount")
  })
})
