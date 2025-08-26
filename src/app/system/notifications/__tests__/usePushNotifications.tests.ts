import { renderHook } from "@testing-library/react-native"
import { useAndroidCreatePushNotificationChannels } from "app/system/notifications/useAndroidCreatePushNotificationChannels"
import { useAndroidListenToFCMMessages } from "app/system/notifications/useAndroidListenToFCMMessages"
import { useHandlePushNotifications } from "app/system/notifications/useHandlePushNotifications"
import { usePushNotifications } from "app/system/notifications/usePushNotifications"
import { useRegisterForPushNotifications } from "app/system/notifications/useRegisterForRemoteMessages"

jest.mock("../useAndroidCreatePushNotificationChannels", () => ({
  useAndroidCreatePushNotificationChannels: jest.fn(),
}))

jest.mock("../useRegisterForRemoteMessages", () => ({
  useRegisterForPushNotifications: jest.fn(),
}))

jest.mock("../useAndroidListenToFCMMessages", () => ({
  useAndroidListenToFCMMessages: jest.fn(),
}))

jest.mock("../useHandlePushNotifications", () => ({
  useHandlePushNotifications: jest.fn(),
}))

describe("usePushNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should call all required hooks in correct order", () => {
    renderHook(() => usePushNotifications())

    expect(useAndroidCreatePushNotificationChannels).toHaveBeenCalledTimes(1)
    expect(useRegisterForPushNotifications).toHaveBeenCalledTimes(1)
    expect(useAndroidListenToFCMMessages).toHaveBeenCalledTimes(1)
    expect(useHandlePushNotifications).toHaveBeenCalledTimes(1)
  })

  it("should not throw errors during hook execution", () => {
    expect(() => {
      renderHook(() => usePushNotifications())
    }).not.toThrow()
  })
})
