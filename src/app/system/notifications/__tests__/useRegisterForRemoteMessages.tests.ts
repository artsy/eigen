import { renderHook } from "@testing-library/react-native"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { GlobalStore } from "app/store/GlobalStore"
import { useRegisterForPushNotifications } from "app/system/notifications/useRegisterForRemoteMessages"
import { saveToken } from "app/utils/PushNotification"
import { Platform } from "react-native"

const mockMessagingInstance = {
  registerDeviceForRemoteMessages: jest.fn(),
  getToken: jest.fn(),
  onTokenRefresh: jest.fn(),
}

jest.mock("@react-native-firebase/messaging", () => {
  return {
    __esModule: true,
    default: jest.fn(() => mockMessagingInstance),
  }
})

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

// Mock react-native Platform
jest.mock("react-native", () => ({
  Platform: {
    OS: "android", // default value
  },
}))

describe("useRegisterForPushNotifications", () => {
  // Mock references
  const mockRegisterDeviceForRemoteMessages =
    mockMessagingInstance.registerDeviceForRemoteMessages as jest.Mock
  const mockGetToken = mockMessagingInstance.getToken as jest.Mock
  const mockOnTokenRefresh = mockMessagingInstance.onTokenRefresh as jest.Mock
  const mockGetPushToken = LegacyNativeModules.ArtsyNativeModule.getPushToken as jest.Mock
  const mockUseAppState = GlobalStore.useAppState as jest.Mock
  const mockSaveToken = saveToken as jest.Mock

  // Helper function to wait for async operations
  const waitForAsync = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

  beforeEach(() => {
    jest.clearAllMocks()

    // Reset platform to android
    ;(Platform as any).OS = "android"

    // Default mock implementations
    mockUseAppState.mockReturnValue(true) // isLoggedIn = true by default
    mockRegisterDeviceForRemoteMessages.mockResolvedValue(undefined)
    mockSaveToken.mockResolvedValue(true)
    mockGetToken.mockResolvedValue("test-token")
    mockGetPushToken.mockResolvedValue("test-token")

    // Mock unsubscribe function
    const mockUnsubscribe = jest.fn()
    mockOnTokenRefresh.mockReturnValue(mockUnsubscribe)
  })

  describe("when user is logged in", () => {
    describe("Android platform", () => {
      beforeEach(() => {
        ;(Platform as any).OS = "android"
      })

      it("should register device and get token from messaging", async () => {
        const mockToken = "android-fcm-token-123"
        mockGetToken.mockResolvedValue(mockToken)

        renderHook(() => useRegisterForPushNotifications())

        // Wait for the async operations to complete
        await waitForAsync()

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

        await waitForAsync()

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
        ;(Platform as any).OS = "ios"
      })

      it("should register device and get token from native module", async () => {
        const mockToken = "ios-apns-token-123"
        mockGetPushToken.mockResolvedValue(mockToken)

        renderHook(() => useRegisterForPushNotifications())

        await waitForAsync()

        expect(mockRegisterDeviceForRemoteMessages).toHaveBeenCalledTimes(1)
        expect(mockGetPushToken).toHaveBeenCalledTimes(1)
        expect(mockGetToken).not.toHaveBeenCalled()
        expect(mockSaveToken).toHaveBeenCalledWith(mockToken)
      })

      it("should handle null token from native module", async () => {
        mockGetPushToken.mockResolvedValue(null)
        const consoleSpy = jest.spyOn(console, "error").mockImplementation()

        renderHook(() => useRegisterForPushNotifications())

        await waitForAsync()

        expect(consoleSpy).toHaveBeenCalledWith("DEBUG: Failed to obtain FCM token")
        expect(mockSaveToken).not.toHaveBeenCalled()

        consoleSpy.mockRestore()
      })
    })

    describe("Error handling", () => {
      it("should handle registration errors", async () => {
        const mockError = new Error("Registration failed")
        mockRegisterDeviceForRemoteMessages.mockRejectedValue(mockError)
        const consoleSpy = jest.spyOn(console, "error").mockImplementation()

        renderHook(() => useRegisterForPushNotifications())

        await waitForAsync()

        expect(consoleSpy).toHaveBeenCalledWith(
          "DEBUG: Error in registerForRemoteMessages:",
          mockError
        )
        expect(mockSaveToken).not.toHaveBeenCalled()
        consoleSpy.mockRestore()
      })

      it("should handle empty token", async () => {
        mockGetToken.mockResolvedValue("")
        const consoleSpy = jest.spyOn(console, "error").mockImplementation()

        renderHook(() => useRegisterForPushNotifications())

        await waitForAsync()

        expect(consoleSpy).toHaveBeenCalledWith("DEBUG: Failed to obtain FCM token")
        expect(mockSaveToken).not.toHaveBeenCalled()
        consoleSpy.mockRestore()
      })
    })
  })

  describe("when user is not logged in", () => {
    beforeEach(() => {
      mockUseAppState.mockReturnValue(false) // isLoggedIn = false
    })

    it("should not register for push notifications", async () => {
      renderHook(() => useRegisterForPushNotifications())

      // Wait a bit to ensure no async operations are triggered
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(mockRegisterDeviceForRemoteMessages).not.toHaveBeenCalled()
      expect(mockGetToken).not.toHaveBeenCalled()
      expect(mockGetPushToken).not.toHaveBeenCalled()
      expect(mockSaveToken).not.toHaveBeenCalled()
    })

    it("should register when user logs in", async () => {
      const { rerender } = renderHook(() => useRegisterForPushNotifications())

      expect(mockRegisterDeviceForRemoteMessages).not.toHaveBeenCalled()

      // User logs in
      mockUseAppState.mockReturnValue(true)
      rerender(() => {})

      await waitForAsync()

      expect(mockRegisterDeviceForRemoteMessages).toHaveBeenCalled()
    })
  })

  describe("Cleanup", () => {
    it("should return unsubscribe function from token refresh listener", async () => {
      const mockUnsubscribe = jest.fn()
      mockOnTokenRefresh.mockReturnValue(mockUnsubscribe)

      renderHook(() => useRegisterForPushNotifications())

      await waitForAsync()

      expect(mockOnTokenRefresh).toHaveBeenCalledTimes(1)
      // The unsubscribe function should be available (though not directly testable
      // without changing the hook implementation to return it)
      expect(mockOnTokenRefresh).toHaveReturnedWith(mockUnsubscribe)
    })
  })
})
