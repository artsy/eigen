import notifee, { AuthorizationStatus } from "@notifee/react-native"
import messaging from "@react-native-firebase/messaging"
import { renderHook } from "@testing-library/react-hooks"
import { useAndroidListenToFCMMessages } from "app/system/notifications/useAndroidListenToFCMMessages"
import { Platform } from "react-native"

jest.mock("@notifee/react-native", () => ({
  getNotificationSettings: jest.fn(),
  displayNotification: jest.fn(),
  AuthorizationStatus: {
    AUTHORIZED: 1,
    DENIED: 0,
  },
}))

jest.mock("@react-native-firebase/messaging", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    onMessage: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
  })),
}))

jest.mock("react-native", () => ({
  Platform: { OS: "android" },
}))

describe("useAndroidListenToFCMMessages", () => {
  const mockMessaging = messaging()
  const mockOnMessage = mockMessaging.onMessage as jest.Mock
  const mockSetBackgroundMessageHandler = mockMessaging.setBackgroundMessageHandler as jest.Mock
  const mockGetNotificationSettings = notifee.getNotificationSettings as jest.Mock
  const mockDisplayNotification = notifee.displayNotification as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    Platform.OS = "android"

    // Default mocks
    const mockUnsubscribe = jest.fn()
    mockOnMessage.mockReturnValue(mockUnsubscribe)
    mockGetNotificationSettings.mockResolvedValue({
      authorizationStatus: AuthorizationStatus.AUTHORIZED,
    })
    mockDisplayNotification.mockResolvedValue({})
  })

  describe("Android platform", () => {
    it("should set up FCM message listeners on Android", () => {
      renderHook(() => useAndroidListenToFCMMessages())

      expect(mockOnMessage).toHaveBeenCalledTimes(1)
      expect(mockOnMessage).toHaveBeenCalledWith(expect.any(Function))
      expect(mockSetBackgroundMessageHandler).toHaveBeenCalledTimes(1)
      expect(mockSetBackgroundMessageHandler).toHaveBeenCalledWith(expect.any(Function))
    })

    it("should display notification when message received with authorized status", async () => {
      renderHook(() => useAndroidListenToFCMMessages())

      const messageHandler = mockOnMessage.mock.calls[0][0]
      const mockMessage = {
        notification: {
          title: "Test Title",
          body: "Test Body",
          android: {
            channelId: "test-channel",
            count: 5,
          },
        },
        data: {
          customData: "test-data",
        },
      }

      await messageHandler(mockMessage)

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1)
      expect(mockDisplayNotification).toHaveBeenCalledWith({
        title: "Test Title",
        body: "Test Body",
        data: {
          title: "Test Title",
          body: "Test Body",
          android: {
            channelId: "test-channel",
            count: 5,
          },
          customData: "test-data",
        },
        android: {
          smallIcon: "ic_notification",
          channelId: "test-channel",
          badgeCount: 5,
        },
      })
    })

    it("should use default channel when no channelId provided", async () => {
      renderHook(() => useAndroidListenToFCMMessages())

      const messageHandler = mockOnMessage.mock.calls[0][0]
      const mockMessage = {
        notification: {
          title: "Test Title",
          body: "Test Body",
        },
        data: {},
      }

      await messageHandler(mockMessage)

      expect(mockDisplayNotification).toHaveBeenCalledWith({
        title: "Test Title",
        body: "Test Body",
        data: {
          title: "Test Title",
          body: "Test Body",
        },
        android: {
          smallIcon: "ic_notification",
          channelId: "Default",
          badgeCount: undefined,
        },
      })
    })

    it("should not display notification when authorization status is denied", async () => {
      mockGetNotificationSettings.mockResolvedValue({
        authorizationStatus: AuthorizationStatus.DENIED,
      })

      renderHook(() => useAndroidListenToFCMMessages())

      const messageHandler = mockOnMessage.mock.calls[0][0]
      const mockMessage = {
        notification: {
          title: "Test Title",
          body: "Test Body",
        },
        data: {},
      }

      await messageHandler(mockMessage)

      expect(mockGetNotificationSettings).toHaveBeenCalledTimes(1)
      expect(mockDisplayNotification).not.toHaveBeenCalled()
    })

    it("should handle errors gracefully", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()
      mockDisplayNotification.mockRejectedValue(new Error("Display failed"))

      renderHook(() => useAndroidListenToFCMMessages())

      const messageHandler = mockOnMessage.mock.calls[0][0]
      const mockMessage = {
        notification: {
          title: "Test Title",
          body: "Test Body",
        },
        data: {},
      }

      await messageHandler(mockMessage)

      expect(consoleSpy).toHaveBeenCalledWith(
        "DEBUG: error handling FCM message:",
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })

    it("should cleanup listeners on unmount", () => {
      const mockUnsubscribe = jest.fn()
      mockOnMessage.mockReturnValue(mockUnsubscribe)

      const { unmount } = renderHook(() => useAndroidListenToFCMMessages())

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
    })
  })

  describe("iOS platform", () => {
    beforeEach(() => {
      Platform.OS = "ios"
    })

    it("should not set up listeners on iOS", () => {
      renderHook(() => useAndroidListenToFCMMessages())

      expect(mockOnMessage).not.toHaveBeenCalled()
      expect(mockSetBackgroundMessageHandler).not.toHaveBeenCalled()
    })
  })

  describe("Background message handler", () => {
    it("should set up background message handler correctly", async () => {
      renderHook(() => useAndroidListenToFCMMessages())

      const backgroundHandler = mockSetBackgroundMessageHandler.mock.calls[0][0]
      const mockMessage = {
        notification: {
          title: "Background Title",
          body: "Background Body",
        },
        data: { key: "value" },
      }

      await backgroundHandler(mockMessage)

      expect(mockGetNotificationSettings).toHaveBeenCalled()
      expect(mockDisplayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Background Title",
          body: "Background Body",
        })
      )
    })
  })
})
