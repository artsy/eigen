import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { requestPushNotificationsPermission } from "app/utils/requestPushNotificationsPermission"
import PushNotification from "react-native-push-notification"

jest.mock("react-native-push-notification", () => ({
  requestPermissions: jest.fn(),
}))

describe("requestPushNotificationsPermission", () => {
  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    }) // this mocks out setTimeout and other timer functions
  })

  afterEach(() => {
    jest.runAllTimers() // this runs any timers that were set
    jest.useRealTimers() // this returns timers back to normal
  })

  it("does not request push permissions if push permissions were requested this session", async () => {
    __globalStoreTestUtils__?.injectState({
      artsyPrefs: {
        pushPromptLogic: {
          pushPermissionsRequestedThisSession: true,
        },
      },
    })

    const requestPushPromise = requestPushNotificationsPermission()

    jest.runOnlyPendingTimers()
    jest.advanceTimersByTime(3000)

    await requestPushPromise

    expect(PushNotification.requestPermissions).not.toHaveBeenCalled()
  })

  it("marks push requested this session after a request", async () => {
    __globalStoreTestUtils__?.injectState({
      artsyPrefs: {
        pushPromptLogic: {
          pushPermissionsRequestedThisSession: false,
        },
      },
    })

    const requestPushPromise = requestPushNotificationsPermission()

    jest.runOnlyPendingTimers()
    jest.advanceTimersByTime(3000)

    await requestPushPromise

    expect(PushNotification.requestPermissions).toHaveBeenCalled()

    const pushRequestedThisSession =
      __globalStoreTestUtils__?.getCurrentState().artsyPrefs.pushPromptLogic
        .pushPermissionsRequestedThisSession

    expect(pushRequestedThisSession).toBe(true)
  })
})
