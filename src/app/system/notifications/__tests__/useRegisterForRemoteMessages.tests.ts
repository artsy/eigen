import messaging from "@react-native-firebase/messaging"
import { renderHook } from "@testing-library/react-hooks"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { GlobalStore } from "app/store/GlobalStore"
import { useRegisterForPushNotifications } from "app/system/notifications/useRegisterForRemoteMessages"
import { saveToken } from "app/utils/PushNotification"
import { Platform } from "react-native"

jest.mock("@react-native-firebase/messaging", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    registerDeviceForRemoteMessages: jest.fn(),
    getToken: jest.fn(),
    onTokenRefresh: jest.fn(),
  })),
}))

jest.mock("app/NativeModules/LegacyNativeModules", () => ({
  LegacyNativeModules: {
    ArtsyNativeModule: {
      getPushToken: jest.fn(),
    },
  },
}))

jest.mock("app/store/GlobalStore", () => ({
  GlobalStore: {
    useAppState: jest.fn(),
  },
}))

jest.mock("app/utils/PushNotification", () => ({
  saveToken: jest.fn(),
}))

jest.mock("react-native", () => ({
  Platform: { OS: "android" },
}))

describe("useRegisterForPushNotifications", () => {
  const mockMessaging = messaging()
  const mockRegisterDeviceForRemoteMessages =
    mockMessaging.registerDeviceForRemoteMessages as jest.Mock
  const mockGetToken = mockMessaging.getToken as jest.Mock
  const mockOnTokenRefresh = mockMessaging.onTokenRefresh as jest.Mock
  const mockGetPushToken = LegacyNativeModules.ArtsyNativeModule.getPushToken as jest.Mock
  const mockUseAppState = GlobalStore.useAppState as jest.Mock
  const mockSaveToken = saveToken as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAppState.mockReturnValue(true) // isLoggedIn = true
    mockRegisterDeviceForRemoteMessages.mockResolvedValue(undefined)
    mockSaveToken.mockResolvedValue(undefined)
    mockOnTokenRefresh.mockReturnValue(jest.fn())
  })

  describe("when user is logged in", () => {
    describe("Android platform", () => {
      beforeEach(() => {
        Platform.OS = "android"
      })

      it("should register device and get token from messaging", async () => {
        const mockToken = "android-fcm-token-123"
        mockGetToken.mockResolvedValue(mockToken)

        renderHook(() => useRegisterForPushNotifications())

        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(mockRegisterDeviceForRemoteMessages).toHaveBeenCalledTimes(1)
        expect(mockGetToken).toHaveBeenCalledTimes(1)
        expect(mockGetPushToken).not.toHaveBeenCalled()
        expect(mockSaveToken).toHaveBeenCalledWith(mockToken)
      })

      it("should set up token refresh listener", async () => {
        const mockToken = "android-fcm-token-123"
        const mockRefreshedToken = "refreshed-token-456"
        const mockUnsubscribe = jest.fn()

        mockGetToken.mockResolvedValue(mockToken)
        mockOnTokenRefresh.mockReturnValue(mockUnsubscribe)

        renderHook(() => useRegisterForPushNotifications())

        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(mockOnTokenRefresh).toHaveBeenCalledTimes(1)
        expect(mockOnTokenRefresh).toHaveBeenCalledWith(expect.any(Function))

        // Test token refresh callback
        const tokenRefreshCallback = mockOnTokenRefresh.mock.calls[0][0]
        await tokenRefreshCallback(mockRefreshedToken)

        expect(mockSaveToken).toHaveBeenCalledWith(mockRefreshedToken)
      })
    })

    describe("iOS platform", () => {
      beforeEach(() => {
        Platform.OS = "ios"
      })

      it("should register device and get token from native module", async () => {
        const mockToken = "ios-apns-token-123"
        mockGetPushToken.mockResolvedValue(mockToken)

        renderHook(() => useRegisterForPushNotifications())

        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(mockRegisterDeviceForRemoteMessages).toHaveBeenCalledTimes(1)
        expect(mockGetToken).not.toHaveBeenCalled()
        expect(mockGetPushToken).toHaveBeenCalledTimes(1)
        expect(mockSaveToken).toHaveBeenCalledWith(mockToken)
      })

      it("should handle null token from native module", async () => {
        mockGetPushToken.mockResolvedValue(null)
        const consoleSpy = jest.spyOn(console, "error").mockImplementation()

        renderHook(() => useRegisterForPushNotifications())

        await new Promise((resolve) => setTimeout(resolve, 0))

        expect(mockSaveToken).not.toHaveBeenCalled()
        expect(consoleSpy).toHaveBeenCalledWith("DEBUG: Failed to obtain FCM token")

        consoleSpy.mockRestore()
      })
    })

    it("should handle registration errors", async () => {
      const mockError = new Error("Registration failed")
      mockRegisterDeviceForRemoteMessages.mockRejectedValue(mockError)
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      renderHook(() => useRegisterForPushNotifications())

      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(consoleSpy).toHaveBeenCalledWith(
        "DEBUG: Error in registerForRemoteMessages:",
        mockError
      )
      expect(mockSaveToken).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it("should handle token save errors", async () => {
      const mockToken = "test-token"
      const mockSaveError = new Error("Save failed")
      mockGetToken.mockResolvedValue(mockToken)
      mockSaveToken.mockRejectedValue(mockSaveError)
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      renderHook(() => useRegisterForPushNotifications())

      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(consoleSpy).toHaveBeenCalledWith("DEBUG: Failed to save token:", mockSaveError)

      consoleSpy.mockRestore()
    })

    it("should handle empty token", async () => {
      mockGetToken.mockResolvedValue("")
      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      renderHook(() => useRegisterForPushNotifications())

      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(consoleSpy).toHaveBeenCalledWith("DEBUG: Failed to obtain FCM token")
      expect(mockSaveToken).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it("should handle token refresh errors", async () => {
      const mockToken = "test-token"
      const mockRefreshedToken = "refreshed-token"
      const mockSaveError = new Error("Refresh save failed")

      mockGetToken.mockResolvedValue(mockToken)
      mockSaveToken.mockResolvedValueOnce(undefined).mockRejectedValueOnce(mockSaveError)

      const consoleSpy = jest.spyOn(console, "error").mockImplementation()

      renderHook(() => useRegisterForPushNotifications())

      await new Promise((resolve) => setTimeout(resolve, 0))

      // Test token refresh error
      const tokenRefreshCallback = mockOnTokenRefresh.mock.calls[0][0]
      await tokenRefreshCallback(mockRefreshedToken)

      expect(consoleSpy).toHaveBeenCalledWith(
        "DEBUG: Failed to save refreshed token:",
        mockSaveError
      )

      consoleSpy.mockRestore()
    })
  })

  describe("when user is not logged in", () => {
    beforeEach(() => {
      mockUseAppState.mockReturnValue(false) // isLoggedIn = false
    })

    it("should not register for push notifications", () => {
      renderHook(() => useRegisterForPushNotifications())

      expect(mockRegisterDeviceForRemoteMessages).not.toHaveBeenCalled()
      expect(mockGetToken).not.toHaveBeenCalled()
      expect(mockGetPushToken).not.toHaveBeenCalled()
      expect(mockSaveToken).not.toHaveBeenCalled()
    })

    it("should register when user logs in", () => {
      const { rerender } = renderHook(() => useRegisterForPushNotifications())

      expect(mockRegisterDeviceForRemoteMessages).not.toHaveBeenCalled()

      // User logs in
      mockUseAppState.mockReturnValue(true)
      rerender()

      expect(mockRegisterDeviceForRemoteMessages).toHaveBeenCalled()
    })
  })
})
