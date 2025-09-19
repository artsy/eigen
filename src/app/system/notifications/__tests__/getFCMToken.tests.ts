import messaging from "@react-native-firebase/messaging"
import { getFCMToken } from "app/system/notifications/getFCMToken"

describe("getFCMToken", () => {
  const mockMessaging = messaging as jest.MockedFunction<typeof messaging>
  const mockMessagingInstance = {
    registerDeviceForRemoteMessages: jest.fn(),
    getToken: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockMessaging.mockReturnValue(mockMessagingInstance as any)
  })

  it("should register device and return FCM token successfully", async () => {
    const mockToken = "mock-fcm-token-12345"
    mockMessagingInstance.registerDeviceForRemoteMessages.mockResolvedValue(undefined)
    mockMessagingInstance.getToken.mockResolvedValue(mockToken)

    const result = await getFCMToken()

    expect(mockMessagingInstance.registerDeviceForRemoteMessages).toHaveBeenCalledTimes(1)
    expect(mockMessagingInstance.getToken).toHaveBeenCalledTimes(1)
    expect(result).toBe(mockToken)
  })

  it("should handle registration error", async () => {
    const mockError = new Error("Registration failed")
    mockMessagingInstance.registerDeviceForRemoteMessages.mockRejectedValue(mockError)

    await expect(getFCMToken()).rejects.toThrow("Registration failed")
    expect(mockMessagingInstance.registerDeviceForRemoteMessages).toHaveBeenCalledTimes(1)
    expect(mockMessagingInstance.getToken).not.toHaveBeenCalled()
  })

  it("should handle token retrieval error", async () => {
    const mockError = new Error("Token retrieval failed")
    mockMessagingInstance.registerDeviceForRemoteMessages.mockResolvedValue(undefined)
    mockMessagingInstance.getToken.mockRejectedValue(mockError)

    await expect(getFCMToken()).rejects.toThrow("Token retrieval failed")
    expect(mockMessagingInstance.registerDeviceForRemoteMessages).toHaveBeenCalledTimes(1)
    expect(mockMessagingInstance.getToken).toHaveBeenCalledTimes(1)
  })

  it("should handle null/undefined token", async () => {
    mockMessagingInstance.registerDeviceForRemoteMessages.mockResolvedValue(undefined)
    mockMessagingInstance.getToken.mockResolvedValue(null)

    const result = await getFCMToken()

    expect(mockMessagingInstance.registerDeviceForRemoteMessages).toHaveBeenCalledTimes(1)
    expect(mockMessagingInstance.getToken).toHaveBeenCalledTimes(1)
    expect(result).toBeNull()
  })
})
