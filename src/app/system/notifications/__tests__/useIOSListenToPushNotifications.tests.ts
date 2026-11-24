import { act, renderHook } from "@testing-library/react-native"
import { NotificationsManager } from "app/NativeModules/NotificationsManager"
import { useIOSListenToPushNotifications } from "app/system/notifications/useIOSListenToPushNotifications"
import { Platform } from "react-native"

// Mock the NotificationsManager (already mocked globally as EventEmitter)
const mockNotificationsManager = NotificationsManager as jest.Mocked<typeof NotificationsManager>
const mockSetPushNotification = jest.fn()

describe("useIOSListenToPushNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup Platform to iOS using Object.defineProperty
    Object.defineProperty(Platform, "OS", {
      get: jest.fn(() => "ios"),
      configurable: true,
    })
  })

  describe("Event listening", () => {
    it("sets up native event listener on mount", async () => {
      const mockAddListener = jest.spyOn(mockNotificationsManager, "addListener")

      await renderHook(() =>
        useIOSListenToPushNotifications({ setPushNotification: mockSetPushNotification })
      )

      expect(mockAddListener).toHaveBeenCalledWith("event", expect.any(Function))
    })

    it("handles NOTIFICATION_RECEIVED event with Tapped action", async () => {
      let eventHandler: (event: any) => void

      // Capture the event handler when addListener is called
      const mockAddListener = jest.spyOn(mockNotificationsManager, "addListener")
      mockAddListener.mockImplementation((_eventName, handler) => {
        eventHandler = handler
        return { remove: jest.fn() } as any
      })

      await renderHook(() =>
        useIOSListenToPushNotifications({ setPushNotification: mockSetPushNotification })
      )

      const testEvent = {
        type: "NOTIFICATION_RECEIVED",
        payload: {
          NotificationAction: "Tapped",
          label: "Test iOS Notification",
          url: "https://example.com/ios",
          message: "iOS test message",
          customData: "ios-test-data",
        },
      }

      await act(() => {
        eventHandler(testEvent)
      })

      expect(mockSetPushNotification).toHaveBeenCalledWith({
        label: "Test iOS Notification",
        url: "https://example.com/ios",
        message: "iOS test message",
        data: {
          NotificationAction: "Tapped",
          label: "Test iOS Notification",
          url: "https://example.com/ios",
          message: "iOS test message",
          customData: "ios-test-data",
        },
      })
    })

    it("handles NOTIFICATION_RECEIVED event with undefined payload values", async () => {
      let eventHandler: (event: any) => void

      const mockAddListener = jest.spyOn(mockNotificationsManager, "addListener")
      mockAddListener.mockImplementation((_eventName, handler) => {
        eventHandler = handler
        return { remove: jest.fn() } as any
      })

      await renderHook(() =>
        useIOSListenToPushNotifications({ setPushNotification: mockSetPushNotification })
      )

      const testEvent = {
        type: "NOTIFICATION_RECEIVED",
        payload: {
          NotificationAction: "Tapped",
          // label, url, message are undefined
        },
      }

      await act(() => {
        eventHandler!(testEvent)
      })

      expect(mockSetPushNotification).toHaveBeenCalledWith({
        label: undefined,
        url: undefined,
        message: undefined,
        data: {
          NotificationAction: "Tapped",
        },
      })
    })

    it("ignores NOTIFICATION_RECEIVED event without payload", async () => {
      let eventHandler: (event: any) => void

      const mockAddListener = jest.spyOn(mockNotificationsManager, "addListener")
      mockAddListener.mockImplementation((_eventName, handler) => {
        eventHandler = handler
        return { remove: jest.fn() } as any
      })

      await renderHook(() =>
        useIOSListenToPushNotifications({ setPushNotification: mockSetPushNotification })
      )

      const testEvent = {
        type: "NOTIFICATION_RECEIVED",
        // No payload
      }

      await act(() => {
        eventHandler!(testEvent)
      })

      expect(mockSetPushNotification).not.toHaveBeenCalled()
    })

    it("ignores non-NOTIFICATION_RECEIVED events", async () => {
      let eventHandler: (event: any) => void

      const mockAddListener = jest.spyOn(mockNotificationsManager, "addListener")
      mockAddListener.mockImplementation((_eventName, handler) => {
        eventHandler = handler
        return { remove: jest.fn() } as any
      })

      await renderHook(() =>
        useIOSListenToPushNotifications({ setPushNotification: mockSetPushNotification })
      )

      const testEvents = [
        {
          type: "STATE_CHANGED",
          payload: { NotificationAction: "Tapped" },
        },
        {
          type: "EVENT_TRACKING",
          payload: { NotificationAction: "Tapped" },
        },
        {
          type: "REQUEST_NAVIGATION",
          payload: { NotificationAction: "Tapped" },
        },
      ]

      for (const testEvent of testEvents) {
        await act(() => {
          eventHandler!(testEvent)
        })
      }

      expect(mockSetPushNotification).not.toHaveBeenCalled()
    })
  })
})
