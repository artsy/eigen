import notifee, { Event, EventType, Notification } from "@notifee/react-native"
import { renderHook } from "@testing-library/react-hooks"
import { listenToNativeEvents } from "app/NativeModules/utils/listenToNativeEvents"
import { GlobalStore } from "app/store/GlobalStore"
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { useHandlePushNotifications } from "app/system/notifications/useHandlePushNotifications"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { EmitterSubscription, Platform } from "react-native"

jest.mock("@notifee/react-native", () => ({
  __esModule: true,
  default: {
    onForegroundEvent: jest.fn(),
    onBackgroundEvent: jest.fn(),
    getInitialNotification: jest.fn(),
  },
  EventType: {
    PRESS: "press",
    DELIVERED: "delivered",
  },
}))

jest.mock("app/NativeModules/utils/listenToNativeEvents", () => ({
  listenToNativeEvents: jest.fn(),
}))

jest.mock("app/store/GlobalStore", () => ({
  GlobalStore: {
    useAppState: jest.fn(),
  },
}))

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
  navigationEvents: {
    emit: jest.fn(),
  },
}))

jest.mock("app/utils/loggers", () => ({
  logNotification: true,
}))

jest.mock("app/utils/track/constants", () => ({
  AnalyticsConstants: {
    NotificationTapped: {
      key: "notification_tapped",
    },
  },
}))

jest.mock("react-native", () => ({
  Platform: {
    OS: "android", // default value
  },
  EmitterSubscription: jest.fn(),
}))

describe("useHandlePushNotifications", () => {
  // Mock references
  const mockOnForegroundEvent = notifee.onForegroundEvent as jest.Mock
  const mockOnBackgroundEvent = notifee.onBackgroundEvent as jest.Mock
  const mockGetInitialNotification = notifee.getInitialNotification as jest.Mock
  const mockListenToNativeEvents = listenToNativeEvents as jest.Mock
  const mockUseAppState = GlobalStore.useAppState as jest.Mock
  const mockNavigate = navigate as jest.Mock
  const mockNavigationEventsEmit = navigationEvents.emit as jest.Mock

  // Mock emitter subscription
  const mockUnsubscribe = jest.fn()
  const mockEmitterSubscription = {
    remove: mockUnsubscribe,
  } as unknown as EmitterSubscription

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock console methods
    console.log = jest.fn()

    // Reset platform to android
    ;(Platform as any).OS = "android"

    // Default mock implementations
    mockUseAppState
      .mockReturnValueOnce(true) // isLoggedIn
      .mockReturnValueOnce(true) // isNavigationReady

    mockListenToNativeEvents.mockReturnValue(mockEmitterSubscription)
    mockOnForegroundEvent.mockReturnValue(jest.fn()) // unsubscribe function
    mockGetInitialNotification.mockResolvedValue(null)
  })

  describe("handleNotification callback", () => {
    it("should track notification tap event with correct data", () => {
      const mockNotification: Notification = {
        title: "Test Notification",
        body: "Test body",
        data: {
          label: "test-label",
          url: "https://example.com/test",
          customData: "test-data",
        },
      }

      renderHook(() => useHandlePushNotifications())

      // Get the handleNotification function by triggering an Android event
      const mockEvent: Event = {
        type: EventType.PRESS,
        detail: {
          notification: mockNotification,
        },
      }

      // Trigger the foreground event handler
      const foregroundHandler = mockOnForegroundEvent.mock.calls[0][0]
      foregroundHandler(mockEvent)

      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: "test-label",
        url: "https://example.com/test",
        message: "Test body",
      })
    })

    it("should track notification but navigation effect only runs on login state changes", () => {
      const mockNotification: Notification = {
        title: "Test Notification",
        body: "Test body",
        data: {
          url: "https://example.com/artwork/123",
          artworkId: "123",
        },
      }

      renderHook(() => useHandlePushNotifications())

      const mockEvent: Event = {
        type: EventType.PRESS,
        detail: { notification: mockNotification },
      }

      const foregroundHandler = mockOnForegroundEvent.mock.calls[0][0]
      foregroundHandler(mockEvent)

      // Should track the event
      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: undefined,
        url: "https://example.com/artwork/123",
        message: "Test body",
      })

      // Won't navigate immediately because navigation effect only runs when isLoggedIn changes
      // Since user was already logged in, no state change occurred
      expect(mockNavigationEventsEmit).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("should not navigate when URL is missing", () => {
      const mockNotification: Notification = {
        title: "Test Notification",
        body: "Test body",
        data: { someOtherData: "value" },
      }

      renderHook(() => useHandlePushNotifications())

      const mockEvent: Event = {
        type: EventType.PRESS,
        detail: { notification: mockNotification },
      }

      const foregroundHandler = mockOnForegroundEvent.mock.calls[0][0]
      foregroundHandler(mockEvent)

      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockNavigationEventsEmit).not.toHaveBeenCalled()
    })
  })

  describe("User logged out scenario", () => {
    it("should track notification but not navigate when user is not logged in", () => {
      jest.clearAllMocks()

      // Mock user as not logged in
      mockUseAppState.mockImplementation((selector) => {
        if (selector.toString().includes("userAccessToken")) {
          return false // isLoggedIn = false
        }
        if (selector.toString().includes("isNavigationReady")) {
          return true // isNavigationReady = true
        }
        return false
      })

      mockOnForegroundEvent.mockReturnValue(jest.fn())
      mockGetInitialNotification.mockResolvedValue(null)

      const mockNotification: Notification = {
        title: "Test Notification",
        body: "Test body",
        data: { url: "https://example.com/test" },
      }

      renderHook(() => useHandlePushNotifications())

      const mockEvent: Event = {
        type: EventType.PRESS,
        detail: { notification: mockNotification },
      }

      const foregroundHandler = mockOnForegroundEvent.mock.calls[0][0]
      foregroundHandler(mockEvent)

      // Should track but not navigate because user is not logged in
      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: undefined,
        url: "https://example.com/test",
        message: "Test body",
      })
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockNavigationEventsEmit).not.toHaveBeenCalled()
    })
  })

  describe("iOS native events", () => {
    beforeEach(() => {
      ;(Platform as any).OS = "ios"
    })

    it("should subscribe to native events when on iOS and navigation is ready", () => {
      renderHook(() => useHandlePushNotifications())

      expect(mockListenToNativeEvents).toHaveBeenCalledWith(expect.any(Function))
    })

    it("should handle iOS notification tap event but not navigate immediately", () => {
      renderHook(() => useHandlePushNotifications())

      const nativeEventHandler = mockListenToNativeEvents.mock.calls[0][0]
      const mockIOSEvent = {
        type: "NOTIFICATION_RECEIVED",
        payload: {
          NotificationAction: "Tapped",
          aps: {
            alert: {
              title: "iOS Title",
              body: "iOS Body",
            },
          },
          url: "https://example.com/ios",
          customData: "ios-data",
        },
      }

      nativeEventHandler(mockIOSEvent)

      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: undefined,
        url: "https://example.com/ios",
        message: "iOS Body",
      })

      // Won't navigate immediately due to effect dependency design
      expect(mockNavigationEventsEmit).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("should handle iOS notification with fallback title/body", () => {
      renderHook(() => useHandlePushNotifications())

      const nativeEventHandler = mockListenToNativeEvents.mock.calls[0][0]
      const mockIOSEvent = {
        type: "NOTIFICATION_RECEIVED",
        payload: {
          NotificationAction: "Tapped",
          title: "Fallback Title",
          body: "Fallback Body",
          url: "https://example.com/fallback",
        },
      }

      nativeEventHandler(mockIOSEvent)

      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: undefined,
        url: "https://example.com/fallback",
        message: "Fallback Body",
      })
    })

    it("should ignore iOS events that are not notification taps", () => {
      renderHook(() => useHandlePushNotifications())

      const nativeEventHandler = mockListenToNativeEvents.mock.calls[0][0]

      // Test different event types
      const mockNonTapEvent = {
        type: "NOTIFICATION_RECEIVED",
        payload: { NotificationAction: "Dismissed" },
      }

      const mockDifferentEventType = {
        type: "OTHER_EVENT",
        payload: { NotificationAction: "Tapped" },
      }

      nativeEventHandler(mockNonTapEvent)
      nativeEventHandler(mockDifferentEventType)

      expect(mockTrackEvent).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("should cleanup iOS listener on unmount", () => {
      const { unmount } = renderHook(() => useHandlePushNotifications())

      expect(mockListenToNativeEvents).toHaveBeenCalled()

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })

  describe("Android Notifee events", () => {
    beforeEach(() => {
      ;(Platform as any).OS = "android"
    })

    it("should subscribe to foreground and background events", () => {
      renderHook(() => useHandlePushNotifications())

      expect(mockOnForegroundEvent).toHaveBeenCalledWith(expect.any(Function))
      expect(mockOnBackgroundEvent).toHaveBeenCalledWith(expect.any(Function))
    })

    it("should handle PRESS events but not navigate immediately", () => {
      const mockNotification: Notification = {
        title: "Android Notification",
        body: "Android body",
        data: { url: "https://example.com/android" },
      }

      renderHook(() => useHandlePushNotifications())

      const mockEvent: Event = {
        type: EventType.PRESS,
        detail: { notification: mockNotification },
      }

      const foregroundHandler = mockOnForegroundEvent.mock.calls[0][0]
      foregroundHandler(mockEvent)

      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: undefined,
        url: "https://example.com/android",
        message: "Android body",
      })

      // Won't navigate immediately due to effect dependency design
      expect(mockNavigationEventsEmit).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("should handle DELIVERED events without navigation", () => {
      const mockNotification: Notification = {
        title: "Delivered Notification",
        body: "Delivered body",
        data: { url: "https://example.com/delivered" },
      }

      renderHook(() => useHandlePushNotifications())

      const mockEvent: Event = {
        type: EventType.DELIVERED,
        detail: { notification: mockNotification },
      }

      const foregroundHandler = mockOnForegroundEvent.mock.calls[0][0]
      foregroundHandler(mockEvent)

      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockTrackEvent).not.toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledWith("[DEBUG] NOTIFICATION DELIVERED: ", mockNotification)
    })

    it("should ignore events without notification", () => {
      renderHook(() => useHandlePushNotifications())

      const mockEvent: Event = {
        type: EventType.PRESS,
        detail: {},
      } as Event

      const foregroundHandler = mockOnForegroundEvent.mock.calls[0][0]
      foregroundHandler(mockEvent)

      expect(mockTrackEvent).not.toHaveBeenCalled()
      expect(mockNavigate).not.toHaveBeenCalled()
    })

    it("should handle background events with same logic", async () => {
      const mockNotification: Notification = {
        title: "Background Notification",
        body: "Background body",
        data: { url: "https://example.com/background" },
      }

      renderHook(() => useHandlePushNotifications())

      const mockEvent: Event = {
        type: EventType.PRESS,
        detail: { notification: mockNotification },
      }

      const backgroundHandler = mockOnBackgroundEvent.mock.calls[0][0]
      await backgroundHandler(mockEvent)

      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: undefined,
        url: "https://example.com/background",
        message: "Background body",
      })
    })
  })

  describe("Initial notification handling", () => {
    it("should handle initial notification when navigation is ready", async () => {
      const mockInitialNotification: Notification = {
        title: "Initial Notification",
        body: "Initial body",
        data: { url: "https://example.com/initial" },
      }

      mockGetInitialNotification.mockResolvedValue({
        notification: mockInitialNotification,
      })

      renderHook(() => useHandlePushNotifications())

      await flushPromiseQueue()

      expect(mockGetInitialNotification).toHaveBeenCalled()
      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: undefined,
        url: "https://example.com/initial",
        message: "Initial body",
      })
    })

    it("should handle null initial notification", async () => {
      mockGetInitialNotification.mockResolvedValue(null)

      renderHook(() => useHandlePushNotifications())

      await flushPromiseQueue()

      expect(mockGetInitialNotification).toHaveBeenCalled()
      expect(mockTrackEvent).not.toHaveBeenCalled()
    })
  })

  describe("State changes", () => {
    it("should handle navigation ready state changes properly", async () => {
      // Based on the hook behavior, if isNavigationReady is true initially,
      // getInitialNotification gets called immediately. Let's test the actual behavior.

      jest.clearAllMocks()

      mockUseAppState.mockImplementation((selector) => {
        if (selector.toString().includes("userAccessToken")) {
          return true // isLoggedIn = true
        }
        if (selector.toString().includes("isNavigationReady")) {
          return true // isNavigationReady = true
        }
        return false
      })

      mockListenToNativeEvents.mockReturnValue(mockEmitterSubscription)
      mockOnForegroundEvent.mockReturnValue(jest.fn())
      mockGetInitialNotification.mockResolvedValue(null)

      renderHook(() => useHandlePushNotifications())

      // Should call getInitialNotification when navigation is ready
      await flushPromiseQueue()
      expect(mockGetInitialNotification).toHaveBeenCalled()
    })

    it("should navigate when user logs in after notification received", () => {
      const mockNotification: Notification = {
        title: "Test",
        body: "Test",
        data: { url: "https://example.com/test" },
      }

      jest.clearAllMocks()

      // Start with user logged out
      let userLoggedIn = false
      mockUseAppState.mockImplementation((selector) => {
        if (selector.toString().includes("userAccessToken")) {
          return userLoggedIn // controlled by test
        }
        if (selector.toString().includes("isNavigationReady")) {
          return true // isNavigationReady = true
        }
        return false
      })

      mockOnForegroundEvent.mockReturnValue(jest.fn())
      mockGetInitialNotification.mockResolvedValue(null)

      const { rerender } = renderHook(() => useHandlePushNotifications())

      // Handle notification while logged out
      const mockEvent: Event = {
        type: EventType.PRESS,
        detail: { notification: mockNotification },
      }

      const foregroundHandler = mockOnForegroundEvent.mock.calls[0][0]
      foregroundHandler(mockEvent)

      // Should track but not navigate yet
      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: undefined,
        url: "https://example.com/test",
        message: "Test",
      })
      expect(mockNavigate).not.toHaveBeenCalled()

      // User logs in - this should trigger the navigation effect
      userLoggedIn = true
      rerender()

      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  describe("Navigation edge cases", () => {
    it("should not navigate when notification has no URL even if user is logged in", () => {
      const mockNotification: Notification = {
        title: "No URL Notification",
        body: "No URL body",
        data: { someOtherData: "value" }, // No URL
      }

      jest.clearAllMocks()
      mockUseAppState.mockReturnValue(true) // User logged in

      mockOnForegroundEvent.mockReturnValue(jest.fn())
      mockGetInitialNotification.mockResolvedValue(null)

      renderHook(() => useHandlePushNotifications())

      const mockEvent: Event = {
        type: EventType.PRESS,
        detail: { notification: mockNotification },
      }

      const foregroundHandler = mockOnForegroundEvent.mock.calls[0][0]
      foregroundHandler(mockEvent)

      // Should track but not navigate because no URL
      expect(mockTrackEvent).toHaveBeenCalledWith({
        event_name: "notification_tapped",
        label: undefined,
        url: undefined,
        message: "No URL body",
      })
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockNavigationEventsEmit).not.toHaveBeenCalled()
    })
  })

  describe("Cross-platform compatibility", () => {
    it("should subscribe to different events on iOS vs Android", () => {
      // Test Android
      ;(Platform as any).OS = "android"

      jest.clearAllMocks()
      mockUseAppState
        .mockReturnValueOnce(true) // isLoggedIn
        .mockReturnValueOnce(true) // isNavigationReady

      mockOnForegroundEvent.mockReturnValue(jest.fn())
      mockGetInitialNotification.mockResolvedValue(null)

      const { unmount: unmountAndroid } = renderHook(() => useHandlePushNotifications())

      expect(mockOnForegroundEvent).toHaveBeenCalled()
      expect(mockListenToNativeEvents).not.toHaveBeenCalled()

      unmountAndroid()

      // Test iOS
      ;(Platform as any).OS = "ios"

      jest.clearAllMocks()
      mockUseAppState
        .mockReturnValueOnce(true) // isLoggedIn
        .mockReturnValueOnce(true) // isNavigationReady

      mockListenToNativeEvents.mockReturnValue(mockEmitterSubscription)
      mockOnForegroundEvent.mockReturnValue(jest.fn())
      mockGetInitialNotification.mockResolvedValue(null)

      const { unmount: unmountIOS } = renderHook(() => useHandlePushNotifications())

      expect(mockListenToNativeEvents).toHaveBeenCalled()
      expect(mockOnForegroundEvent).toHaveBeenCalled()

      unmountIOS()
    })
  })
})
