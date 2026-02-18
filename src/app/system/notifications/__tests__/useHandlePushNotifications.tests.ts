import { renderHook } from "@testing-library/react-native"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { useHandlePushNotifications } from "app/system/notifications/useHandlePushNotifications"
import { PushNotification } from "app/system/notifications/usePushNotifications"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { AnalyticsConstants } from "app/utils/track/constants"

// Mock GlobalStore
jest.mock("app/store/GlobalStore", () => ({
  GlobalStore: {
    useAppState: jest.fn(),
  },
}))

const mockNavigate = navigate as jest.MockedFunction<typeof navigate>
const mockUseAppState = GlobalStore.useAppState as jest.MockedFunction<
  typeof GlobalStore.useAppState
>
const mockSetPushNotification = jest.fn()

describe("useHandlePushNotifications", () => {
  let navigationEventsSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    // Spy on navigationEvents.emit
    navigationEventsSpy = jest.spyOn(navigationEvents, "emit")

    jest.spyOn(global, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0)
      return 0
    })
  })

  afterEach(() => {
    navigationEventsSpy?.mockRestore()
    jest.restoreAllMocks()
  })

  it("does not navigate when user is not logged in", () => {
    // Mock user as not logged in but navigation ready
    // useAppState is called with different selectors, we need to handle both
    mockUseAppState.mockImplementation((selector: any) => {
      const mockState = {
        auth: { userAccessToken: null },
        sessionState: { isNavigationReady: true },
      }
      return selector(mockState)
    })

    const mockNotification: PushNotification = {
      label: "Test Notification",
      message: "Test body",
      url: "https://example.com/test",
      data: {
        label: "test-label",
        url: "https://example.com/test",
      },
    }

    renderHook(() =>
      useHandlePushNotifications({
        pushNotification: mockNotification,
        setPushNotification: mockSetPushNotification,
      })
    )

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockSetPushNotification).not.toHaveBeenCalled()
  })

  it("does not navigate when navigation is not ready", () => {
    // Mock user as logged in but navigation not ready
    mockUseAppState.mockImplementation((selector: any) => {
      const mockState = {
        auth: { userAccessToken: "mock-token" },
        sessionState: { isNavigationReady: false },
      }
      return selector(mockState)
    })

    const mockNotification: PushNotification = {
      label: "Test Notification",
      message: "Test body",
      url: "https://example.com/test",
      data: {
        label: "test-label",
        url: "https://example.com/test",
      },
    }

    renderHook(() =>
      useHandlePushNotifications({
        pushNotification: mockNotification,
        setPushNotification: mockSetPushNotification,
      })
    )

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockSetPushNotification).not.toHaveBeenCalled()
  })

  it("calls notification_tapped even if not navigating", () => {
    // Mock user as logged in but navigation not ready
    mockUseAppState.mockImplementation((selector: any) => {
      const mockState = {
        auth: { userAccessToken: "mock-token" },
        sessionState: { isNavigationReady: false },
      }
      return selector(mockState)
    })

    const mockNotification: PushNotification = {
      label: "Test Notification",
      message: "Test body",
      url: "https://example.com/test",
      data: {
        label: "test-label",
        url: "https://example.com/test",
      },
    }

    renderHook(() =>
      useHandlePushNotifications({
        pushNotification: mockNotification,
        setPushNotification: mockSetPushNotification,
      })
    )

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalledWith({
      event_name: AnalyticsConstants.NotificationTapped.key,
      label: "test-label",
      url: "https://example.com/test",
      message: "Test body",
    })
    expect(mockSetPushNotification).not.toHaveBeenCalled()
  })

  it("does not navigate when there is no push notification", () => {
    // Mock user as logged in and navigation ready
    mockUseAppState.mockImplementation((selector: any) => {
      const mockState = {
        auth: { userAccessToken: "mock-token" },
        sessionState: { isNavigationReady: true },
      }
      return selector(mockState)
    })

    renderHook(() =>
      useHandlePushNotifications({
        pushNotification: null,
        setPushNotification: mockSetPushNotification,
      })
    )

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockTrackEvent).not.toHaveBeenCalled()
    expect(mockSetPushNotification).not.toHaveBeenCalled()
  })

  it("navigates and tracks event when all conditions are met", () => {
    // Mock user as logged in and navigation ready
    mockUseAppState.mockImplementation((selector: any) => {
      const mockState = {
        auth: { userAccessToken: "mock-token" },
        sessionState: { isNavigationReady: true },
      }
      return selector(mockState)
    })

    const mockNotification: PushNotification = {
      label: "Test Notification",
      message: "Test body",
      url: "https://example.com/test",
      data: {
        label: "test-label",
        url: "https://example.com/test",
        customData: "test-data",
      },
    }

    renderHook(() =>
      useHandlePushNotifications({
        pushNotification: mockNotification,
        setPushNotification: mockSetPushNotification,
      })
    )

    // Should emit modal dismiss event
    expect(navigationEventsSpy).toHaveBeenCalledWith("requestModalDismiss")

    // Should track the notification tap event
    expect(mockTrackEvent).toHaveBeenCalledWith({
      event_name: AnalyticsConstants.NotificationTapped.key,
      label: "test-label",
      url: "https://example.com/test",
      message: "Test body",
      customData: "test-data",
    })

    // Should navigate to the URL
    expect(mockNavigate).toHaveBeenCalledWith("https://example.com/test", {
      passProps: {
        label: "test-label",
        url: "https://example.com/test",
        customData: "test-data",
      },
      ignoreDebounce: true,
    })

    // Should reset the notification
    expect(mockSetPushNotification).toHaveBeenCalledWith(null)
  })

  it("handles notification with missing data gracefully", () => {
    // Mock user as logged in and navigation ready
    mockUseAppState.mockImplementation((selector: any) => {
      const mockState = {
        auth: { userAccessToken: "mock-token" },
        sessionState: { isNavigationReady: true },
      }
      return selector(mockState)
    })

    const mockNotification: PushNotification = {
      label: "Test Notification",
      message: "Test body",
      url: null,
      data: null,
    }

    renderHook(() =>
      useHandlePushNotifications({
        pushNotification: mockNotification,
        setPushNotification: mockSetPushNotification,
      })
    )

    // Should still emit modal dismiss event
    expect(navigationEventsSpy).toHaveBeenCalledWith("requestModalDismiss")

    // Should track the notification tap event with undefined values
    expect(mockTrackEvent).toHaveBeenCalledWith({
      event_name: AnalyticsConstants.NotificationTapped.key,
      label: "Test Notification",
      url: undefined,
      message: "Test body",
    })

    // Should navigate with undefined URL
    expect(mockNavigate).not.toHaveBeenCalled()

    // Should reset the notification
    expect(mockSetPushNotification).toHaveBeenCalledWith(null)
  })

  it("responds to state changes and triggers navigation when conditions become met", () => {
    // Track whether this is the first render or rerender
    let isFirstRender = true

    mockUseAppState.mockImplementation((selector: any) => {
      const mockState = {
        auth: {
          userAccessToken: isFirstRender ? null : "mock-token",
        },
        sessionState: { isNavigationReady: true },
      }
      return selector(mockState)
    })

    const mockNotification: PushNotification = {
      label: "Test Notification",
      message: "Test body",
      url: "https://example.com/test",
      data: {
        label: "test-label",
        url: "https://example.com/test",
      },
    }

    const { rerender } = renderHook(
      ({ notification }) =>
        useHandlePushNotifications({
          pushNotification: notification,
          setPushNotification: mockSetPushNotification,
        }),
      {
        initialProps: { notification: mockNotification },
      }
    )

    // Initially should not navigate
    expect(mockNavigate).not.toHaveBeenCalled()

    // Change state for rerender
    isFirstRender = false

    // Rerender to trigger the effect with new state
    rerender({ notification: mockNotification })

    // Now should navigate
    expect(mockNavigate).toHaveBeenCalledWith("https://example.com/test", {
      passProps: {
        label: "test-label",
        url: "https://example.com/test",
      },
      ignoreDebounce: true,
    })
  })
})
