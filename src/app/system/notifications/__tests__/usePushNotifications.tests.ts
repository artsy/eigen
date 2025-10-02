import { renderHook } from "@testing-library/react-native"
import { useAndroidCreatePushNotificationChannels } from "app/system/notifications/useAndroidCreatePushNotificationChannels"
import { useAndroidListenToPushNotifications } from "app/system/notifications/useAndroidListenToPushNotifications"
import { useHandlePushNotifications } from "app/system/notifications/useHandlePushNotifications"
import { useIOSListenToPushNotifications } from "app/system/notifications/useIOSListenToPushNotifications"
import { usePushNotifications } from "app/system/notifications/usePushNotifications"
import { useRegisterForPushNotifications } from "app/system/notifications/useRegisterForRemoteMessages"
import { Platform } from "react-native"

// Mock all hooks used by usePushNotifications
jest.mock("../useAndroidCreatePushNotificationChannels", () => ({
  useAndroidCreatePushNotificationChannels: jest.fn(),
}))

jest.mock("../useRegisterForRemoteMessages", () => ({
  useRegisterForPushNotifications: jest.fn(),
}))

jest.mock("../useAndroidListenToPushNotifications", () => ({
  useAndroidListenToPushNotifications: jest.fn(),
}))

jest.mock("../useIOSListenToPushNotifications", () => ({
  useIOSListenToPushNotifications: jest.fn(),
}))

jest.mock("../useHandlePushNotifications", () => ({
  useHandlePushNotifications: jest.fn(),
}))

// Create mock references
const mockUseAndroidCreatePushNotificationChannels =
  useAndroidCreatePushNotificationChannels as jest.MockedFunction<
    typeof useAndroidCreatePushNotificationChannels
  >
const mockUseRegisterForPushNotifications = useRegisterForPushNotifications as jest.MockedFunction<
  typeof useRegisterForPushNotifications
>
const mockUseAndroidListenToPushNotifications =
  useAndroidListenToPushNotifications as jest.MockedFunction<
    typeof useAndroidListenToPushNotifications
  >
const mockUseIOSListenToPushNotifications = useIOSListenToPushNotifications as jest.MockedFunction<
  typeof useIOSListenToPushNotifications
>
const mockUseHandlePushNotifications = useHandlePushNotifications as jest.MockedFunction<
  typeof useHandlePushNotifications
>

describe("usePushNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Android Platform", () => {
    beforeEach(() => {
      // Set platform to Android
      Object.defineProperty(Platform, "OS", {
        get: jest.fn(() => "android"),
        configurable: true,
      })
    })

    it("calls Android-specific hooks when on Android", () => {
      renderHook(() => usePushNotifications())

      // Should call common hooks
      expect(mockUseAndroidCreatePushNotificationChannels).toHaveBeenCalledTimes(1)
      expect(mockUseRegisterForPushNotifications).toHaveBeenCalledTimes(1)
      expect(mockUseHandlePushNotifications).toHaveBeenCalledTimes(1)

      // Should call Android-specific listener
      expect(mockUseAndroidListenToPushNotifications).toHaveBeenCalledTimes(1)

      // Should NOT call iOS-specific listener
      expect(mockUseIOSListenToPushNotifications).not.toHaveBeenCalled()
    })
  })

  describe("iOS Platform", () => {
    beforeEach(() => {
      // Set platform to iOS
      Object.defineProperty(Platform, "OS", {
        get: jest.fn(() => "ios"),
        configurable: true,
      })
    })

    it("calls iOS-specific hooks when on iOS", () => {
      renderHook(() => usePushNotifications())

      // Should call common hooks
      expect(mockUseRegisterForPushNotifications).toHaveBeenCalledTimes(1)
      expect(mockUseHandlePushNotifications).toHaveBeenCalledTimes(1)

      // Should call iOS-specific listener
      expect(mockUseIOSListenToPushNotifications).toHaveBeenCalledTimes(1)

      // Should NOT call Android-specific listener
      expect(mockUseAndroidCreatePushNotificationChannels).not.toHaveBeenCalled()
      expect(mockUseAndroidListenToPushNotifications).not.toHaveBeenCalled()
    })
  })
})
