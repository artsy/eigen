import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { requestPushNotificationsPermission } from "app/utils/requestPushNotificationsPermission"

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

    // Act
    const requestPushPromise = requestPushNotificationsPermission()

    jest.runOnlyPendingTimers()
    jest.advanceTimersByTime(3000)

    await requestPushPromise

    // Assert
    expect(
      LegacyNativeModules.ARTemporaryAPIModule.requestDirectNotificationPermissions
    ).not.toHaveBeenCalled()
  })
})
