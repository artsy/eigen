import notifee from "@notifee/react-native"
import { renderHook } from "@testing-library/react-hooks"
import { GlobalStore } from "app/store/GlobalStore"
import { listenToNativeEvents } from "app/store/NativeModel"
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { useHandlePushNotifications } from "app/system/notifications/useHandlePushNotifications"
import { AnalyticsConstants } from "app/utils/track/constants"
import { Platform } from "react-native"
import { useTracking } from "react-tracking"

jest.mock("react-tracking", () => ({
  useTracking: jest.fn(),
}))

jest.mock("@notifee/react-native", () => ({
  onForegroundEvent: jest.fn(() => jest.fn()),
  onBackgroundEvent: jest.fn(),
  getInitialNotification: jest.fn(),
}))

jest.mock("app/store/GlobalStore", () => ({
  GlobalStore: {
    useAppState: jest.fn(),
  },
}))

jest.mock("app/store/NativeModel", () => ({
  listenToNativeEvents: jest.fn(),
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
  navigationEvents: {
    emit: jest.fn(),
  },
}))

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
  EmitterSubscription: jest.fn(),
}))

describe("useHandlePushNotifications", () => {
  const mockTrackEvent = jest.fn()
  const mockListenToNativeEvents = listenToNativeEvents as jest.Mock
  const mockUseAppState = GlobalStore.useAppState as jest.Mock
  const mockUseTracking = useTracking as jest.Mock
  const mockNotifeeOnForegroundEvent = notifee.onForegroundEvent as jest.Mock
  const mockNotifeeOnBackgroundEvent = notifee.onBackgroundEvent as jest.Mock
  const mockNotifeeGetInitialNotification = notifee.getInitialNotification as jest.Mock
  const mockNavigate = navigate as jest.Mock
  const mockNavigationEventsEmit = navigationEvents.emit as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTracking.mockReturnValue({ trackEvent: mockTrackEvent })
    mockUseAppState
      .mockReturnValueOnce(true) // isLoggedIn
      .mockReturnValueOnce(true) // isNavigationReady
    mockNotifeeOnForegroundEvent.mockReturnValue(jest.fn())
    mockNotifeeGetInitialNotification.mockResolvedValue(null)
    mockListenToNativeEvents.mockReturnValue({ remove: jest.fn() })
  })

  describe("iOS platform", () => {
    beforeEach(() => {
      Platform.OS = "ios"
    })

    it("should set up iOS notification listener on mount", () => {
      renderHook(() => useHandlePushNotifications())

      expect(mockListenToNativeEvents).toHaveBeenCalledTimes(1)
      expect(mockListenToNativeEvents).toHaveBeenCalledWith(expect.any(Function))
    })

    it("should handle iOS notification tap event", () => {
      const mockRemove = jest.fn()
      mockListenToNativeEvents.mockReturnValue({ remove: mockRemove })

      renderHook(() => useHandlePushNotifications())

      const eventHandler = mockListenToNativeEvents.mock.calls[0][0]
      const mockEvent = {
        type: "NOTIFICATION_RECEIVED",
        payload: {
          NotificationAction: "Tapped",
          aps: {
            alert: {
              title: "Test Title",
              body: "Test Body",
            },
          },
          label: "test-label",
          url: "/test-route",
        },
      }

      eventHandler(mockEvent)

      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: AnalyticsConstants.NotificationTapped.key,
        label: "test-label",
        url: "/test-route",
        message: "Test Body",
      })
      expect(mockNavigationEventsEmit).toHaveBeenCalledWith("requestModalDismiss")
      expect(mockNavigate).toHaveBeenCalledWith("/test-route", {
        passProps: mockEvent.payload,
        ignoreDebounce: true,
      })
    })

    it("should not navigate for iOS notification if user not logged in", () => {
      mockUseAppState
        .mockReturnValueOnce(false) // isLoggedIn
        .mockReturnValueOnce(true) // isNavigationReady

      renderHook(() => useHandlePushNotifications())

      const eventHandler = mockListenToNativeEvents.mock.calls[0][0]
      const mockEvent = {
        type: "NOTIFICATION_RECEIVED",
        payload: {
          NotificationAction: "Tapped",
          url: "/test-route",
        },
      }

      eventHandler(mockEvent)

      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockNavigationEventsEmit).not.toHaveBeenCalled()
    })

    it("should cleanup iOS listener on unmount", () => {
      const mockRemove = jest.fn()
      mockListenToNativeEvents.mockReturnValue({ remove: mockRemove })

      const { unmount } = renderHook(() => useHandlePushNotifications())

      unmount()

      expect(mockRemove).toHaveBeenCalledTimes(1)
    })
  })

  describe("Android platform", () => {
    beforeEach(() => {
      Platform.OS = "android"
    })

    it("should not set up iOS listener on Android", () => {
      renderHook(() => useHandlePushNotifications())

      expect(mockListenToNativeEvents).not.toHaveBeenCalled()
    })
  })

  describe("Notifee events", () => {
    it("should set up notifee foreground and background listeners", () => {
      renderHook(() => useHandlePushNotifications())

      expect(mockNotifeeOnForegroundEvent).toHaveBeenCalledTimes(1)
      expect(mockNotifeeOnBackgroundEvent).toHaveBeenCalledTimes(1)
    })

    it("should handle notification press event", () => {
      const mockUnsubscribe = jest.fn()
      mockNotifeeOnForegroundEvent.mockReturnValue(mockUnsubscribe)

      renderHook(() => useHandlePushNotifications())

      const foregroundEventHandler = mockNotifeeOnForegroundEvent.mock.calls[0][0]
      const mockNotificationEvent = {
        type: 1, // EventType.PRESS
        detail: {
          notification: {
            title: "Test Title",
            body: "Test Body",
            data: {
              label: "test-label",
              url: "/test-route",
            },
          },
        },
      }

      foregroundEventHandler(mockNotificationEvent)

      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: AnalyticsConstants.NotificationTapped.key,
        label: "test-label",
        url: "/test-route",
        message: "Test Body",
      })
      expect(mockNavigate).toHaveBeenCalledWith("/test-route", {
        passProps: mockNotificationEvent.detail.notification.data,
        ignoreDebounce: true,
      })
    })

    it("should handle notification delivered event without navigation", () => {
      renderHook(() => useHandlePushNotifications())

      const foregroundEventHandler = mockNotifeeOnForegroundEvent.mock.calls[0][0]
      const mockNotificationEvent = {
        type: 2, // EventType.DELIVERED
        detail: {
          notification: {
            title: "Test Title",
            body: "Test Body",
            data: { url: "/test-route" },
          },
        },
      }

      foregroundEventHandler(mockNotificationEvent)

      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockTrackEvent).not.toHaveBeenCalled()
    })

    it("should ignore events without notification detail", () => {
      renderHook(() => useHandlePushNotifications())

      const foregroundEventHandler = mockNotifeeOnForegroundEvent.mock.calls[0][0]
      const mockNotificationEvent = {
        type: 1, // EventType.PRESS
        detail: {},
      }

      foregroundEventHandler(mockNotificationEvent)

      expect(mockTrackEvent).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("should cleanup notifee listeners on unmount", () => {
      const mockUnsubscribe = jest.fn()
      mockNotifeeOnForegroundEvent.mockReturnValue(mockUnsubscribe)

      const { unmount } = renderHook(() => useHandlePushNotifications())

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
    })
  })

  describe("Initial notification handling", () => {
    it("should handle initial notification when navigation is ready", async () => {
      const mockInitialNotification = {
        notification: {
          title: "Initial Title",
          body: "Initial Body",
          data: {
            label: "initial-label",
            url: "/initial-route",
          },
        },
      }
      mockNotifeeGetInitialNotification.mockResolvedValue(mockInitialNotification)
      mockUseAppState
        .mockReturnValueOnce(true) // isLoggedIn
        .mockReturnValueOnce(true) // isNavigationReady

      renderHook(() => useHandlePushNotifications())

      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(mockNotifeeGetInitialNotification).toHaveBeenCalled()
      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: AnalyticsConstants.NotificationTapped.key,
        label: "initial-label",
        url: "/initial-route",
        message: "Initial Body",
      })
      expect(mockNavigate).toHaveBeenCalledWith("/initial-route", {
        passProps: mockInitialNotification.notification.data,
        ignoreDebounce: true,
      })
    })

    it("should not process initial notification when navigation is not ready", () => {
      mockUseAppState
        .mockReturnValueOnce(true) // isLoggedIn
        .mockReturnValueOnce(false) // isNavigationReady

      renderHook(() => useHandlePushNotifications())

      expect(mockNotifeeGetInitialNotification).not.toHaveBeenCalled()
    })
  })
})
