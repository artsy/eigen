import notifee, { AuthorizationStatus, EventType } from "@notifee/react-native"
import messaging from "@react-native-firebase/messaging"
import { renderHook, act } from "@testing-library/react-native"
import { useAndroidListenToPushNotifications } from "app/system/notifications/useAndroidListenToPushNotifications"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { Platform } from "react-native"

const mockSetPushNotification = jest.fn()

// Mock the modules
const mockNotifee = notifee as jest.Mocked<typeof notifee>

// Create mock messaging instance
const mockMessagingInstance = {
  getInitialNotification: jest.fn(),
  onMessage: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
}

const mockMessaging = messaging as jest.MockedFunction<typeof messaging>
mockMessaging.mockReturnValue(mockMessagingInstance as any)

describe("useAndroidListenToPushNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock Platform.OS to be android for these tests
    Object.defineProperty(Platform, "OS", {
      get: jest.fn(() => "android"),
      configurable: true,
    })

    // Setup default mocks
    mockNotifee.getNotificationSettings.mockResolvedValue({
      authorizationStatus: AuthorizationStatus.AUTHORIZED,
    } as any)

    mockMessagingInstance.getInitialNotification.mockResolvedValue(null)
    mockMessagingInstance.onMessage.mockReturnValue(jest.fn())
    mockMessagingInstance.onNotificationOpenedApp.mockReturnValue(jest.fn())
    mockNotifee.onForegroundEvent.mockReturnValue(jest.fn())
  })

  it("sets push notification on app load (initial notification)", async () => {
    const initialNotification = {
      notification: {
        title: "Initial Test Title",
        body: "Initial test message",
      },
      data: {
        url: "https://example.com/initial",
        customData: "test",
      },
    }

    mockMessagingInstance.getInitialNotification.mockResolvedValue(initialNotification as any)

    renderHook(() =>
      useAndroidListenToPushNotifications({ setPushNotification: mockSetPushNotification })
    )

    // Wait for the effect to complete
    await flushPromiseQueue()

    expect(mockMessagingInstance.getInitialNotification).toHaveBeenCalled()
    expect(mockSetPushNotification).toHaveBeenCalledWith({
      label: "Initial Test Title",
      url: "https://example.com/initial",
      message: "Initial test message",
      data: {
        url: "https://example.com/initial",
        customData: "test",
      },
    })
  })

  it("does not set push notification when no initial notification exists", async () => {
    mockMessagingInstance.getInitialNotification.mockResolvedValue(null)

    renderHook(() =>
      useAndroidListenToPushNotifications({ setPushNotification: mockSetPushNotification })
    )

    // Wait for the effect to complete
    await flushPromiseQueue()

    expect(mockMessagingInstance.getInitialNotification).toHaveBeenCalled()
    expect(mockSetPushNotification).not.toHaveBeenCalled()
  })

  it("handles push notification on foreground when authorized", async () => {
    let messageHandler: any

    mockMessagingInstance.onMessage.mockImplementation((handler: any) => {
      messageHandler = handler
      return jest.fn()
    })

    renderHook(() =>
      useAndroidListenToPushNotifications({ setPushNotification: mockSetPushNotification })
    )

    const testMessage = {
      notification: {
        title: "Foreground Test",
        body: "Foreground message",
        android: {
          channelId: "test-channel",
          count: 5,
        },
      },
      data: {
        url: "https://example.com/foreground",
      },
    }

    await act(async () => {
      await messageHandler(testMessage)
    })

    expect(mockNotifee.getNotificationSettings).toHaveBeenCalled()
    expect(mockNotifee.displayNotification).toHaveBeenCalledWith({
      title: "Foreground Test",
      body: "Foreground message",
      data: {
        title: "Foreground Test",
        body: "Foreground message",
        android: {
          channelId: "test-channel",
          count: 5,
        },
        url: "https://example.com/foreground",
      },
      android: {
        smallIcon: "ic_notification",
        channelId: "test-channel",
        badgeCount: 5,
      },
    })
  })

  it("does not display notification on foreground when not authorized", async () => {
    let messageHandler: any

    mockNotifee.getNotificationSettings.mockResolvedValue({
      authorizationStatus: AuthorizationStatus.DENIED,
    } as any)

    mockMessagingInstance.onMessage.mockImplementation((handler: any) => {
      messageHandler = handler
      return jest.fn()
    })

    renderHook(() =>
      useAndroidListenToPushNotifications({ setPushNotification: mockSetPushNotification })
    )

    const testMessage = {
      notification: {
        title: "Unauthorized Test",
        body: "Should not display",
      },
    }

    await act(async () => {
      await messageHandler(testMessage)
    })

    expect(mockNotifee.getNotificationSettings).toHaveBeenCalled()
    expect(mockNotifee.displayNotification).not.toHaveBeenCalled()
  })

  it("handles push notification on background (app opened from notification)", () => {
    let backgroundHandler: any

    mockMessagingInstance.onNotificationOpenedApp.mockImplementation((handler: any) => {
      backgroundHandler = handler
      return jest.fn()
    })

    renderHook(() =>
      useAndroidListenToPushNotifications({ setPushNotification: mockSetPushNotification })
    )

    const backgroundEvent = {
      notification: {
        title: "Background Test",
        body: "Background message",
      },
      data: {
        url: "https://example.com/background",
        customData: "background-test",
      },
    }

    act(() => {
      backgroundHandler(backgroundEvent)
    })

    expect(mockSetPushNotification).toHaveBeenCalledWith({
      label: "Background Test",
      url: "https://example.com/background",
      message: "Background message",
      data: {
        url: "https://example.com/background",
        customData: "background-test",
      },
    })
  })

  it("handles notifee foreground events (notification press)", () => {
    let foregroundEventHandler: any

    mockNotifee.onForegroundEvent.mockImplementation((handler) => {
      foregroundEventHandler = handler
      return jest.fn()
    })

    renderHook(() =>
      useAndroidListenToPushNotifications({ setPushNotification: mockSetPushNotification })
    )

    const pressEvent = {
      type: EventType.PRESS,
      detail: {
        notification: {
          title: "Notifee Press Test",
          body: "Notification was pressed",
          data: {
            url: "https://example.com/press",
            action: "open",
          },
        },
      },
    }

    act(() => {
      foregroundEventHandler(pressEvent)
    })

    expect(mockSetPushNotification).toHaveBeenCalledWith({
      label: "Notifee Press Test",
      url: "https://example.com/press",
      message: "Notification was pressed",
      data: {
        url: "https://example.com/press",
        action: "open",
      },
    })
  })

  it("handles errors gracefully during message processing", async () => {
    let messageHandler: any
    const consoleSpy = jest.spyOn(console, "error").mockImplementation()

    mockNotifee.displayNotification.mockRejectedValue(new Error("Display failed"))

    mockMessagingInstance.onMessage.mockImplementation((handler: any) => {
      messageHandler = handler
      return jest.fn()
    })

    renderHook(() =>
      useAndroidListenToPushNotifications({ setPushNotification: mockSetPushNotification })
    )

    const testMessage = {
      notification: {
        title: "Error Test",
        body: "This will fail",
      },
    }

    await act(async () => {
      await messageHandler(testMessage)
    })

    expect(consoleSpy).toHaveBeenCalledWith("DEBUG: error handling FCM message:", expect.any(Error))

    consoleSpy.mockRestore()
  })

  it("uses default channel when no channelId is provided", async () => {
    let messageHandler: any

    mockMessagingInstance.onMessage.mockImplementation((handler: any) => {
      messageHandler = handler
      return jest.fn()
    })

    renderHook(() =>
      useAndroidListenToPushNotifications({ setPushNotification: mockSetPushNotification })
    )

    const testMessage = {
      notification: {
        title: "Default Channel Test",
        body: "No channel specified",
      },
    }

    await act(async () => {
      await messageHandler(testMessage)
    })

    expect(mockNotifee.displayNotification).toHaveBeenCalledWith({
      title: "Default Channel Test",
      body: "No channel specified",
      data: {
        title: "Default Channel Test",
        body: "No channel specified",
      },
      android: {
        smallIcon: "ic_notification",
        channelId: "Default",
        badgeCount: undefined,
      },
    })
  })
})
