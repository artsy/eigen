import { NotificationsManager } from "app/NativeModules/NotificationsManager"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { NativeEvent } from "app/store/NativeModel"
import { navigate } from "app/system/navigation/navigate"

beforeEach(() => {
  __globalStoreTestUtils__?.reset()
})

describe("NativeModel", () => {
  it(`triggers a fetch of the current unreadMessagesCount when a notification is received`, () => {
    expect(__globalStoreTestUtils__?.getLastAction()?.type ?? "").not.toContain(
      "fetchCurrentUnreadConversationCount"
    )
    NotificationsManager.emit("event", {
      type: "NOTIFICATION_RECEIVED",
    } as NativeEvent)
    expect(__globalStoreTestUtils__?.getLastAction().type).toContain(
      "fetchCurrentUnreadConversationCount"
    )
  })

  describe("REQUEST_NAVIGATION", () => {
    it("calls the navigation method with only the route param", () => {
      NotificationsManager.emit("event", {
        type: "REQUEST_NAVIGATION",
        payload: {
          route: "some-route-path",
        },
      } as NativeEvent)

      expect(navigate).toBeCalledWith("some-route-path", {
        passProps: undefined,
      })
    })

    it("calls the navigation method with the route and the passed params", () => {
      NotificationsManager.emit("event", {
        type: "REQUEST_NAVIGATION",
        payload: {
          route: "some-route-path",
          props: {
            canRead: false,
            someAdditionalKey: "value",
          },
        },
      } as NativeEvent)

      expect(navigate).toBeCalledWith("some-route-path", {
        passProps: {
          canRead: false,
          someAdditionalKey: "value",
        },
      })
    })
  })
})
