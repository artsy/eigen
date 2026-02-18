import AsyncStorage from "@react-native-async-storage/async-storage"
import { getCurrentEmissionState, unsafe__getEnvironment } from "app/store/GlobalStore"
import { saveToken } from "app/utils/PushNotification"
import { Platform } from "react-native"
import DeviceInfo from "react-native-device-info"

jest.mock("@sentry/react-native", () => ({
  captureMessage: jest.fn(),
}))

jest.mock("react-native-device-info", () => ({
  getDeviceId: jest.fn(),
  getDeviceNameSync: jest.fn(),
}))

jest.mock("app/store/GlobalStore", () => ({
  getCurrentEmissionState: jest.fn(),
  unsafe__getEnvironment: jest.fn(),
}))

global.Request = jest.fn().mockImplementation((url, options) => ({
  url,
  ...options,
}))

describe("PushNotification", () => {
  const mockGetCurrentEmissionState = getCurrentEmissionState as jest.Mock
  const mockUnsafe__getEnvironment = unsafe__getEnvironment as jest.Mock
  const mockGetDeviceId = DeviceInfo.getDeviceId as jest.Mock
  const mockGetDeviceNameSync = DeviceInfo.getDeviceNameSync as jest.Mock
  const mockFetch = fetch as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    Platform.OS = "android"

    // Default mocks
    mockUnsafe__getEnvironment.mockReturnValue({
      gravityURL: "https://api.artsy.net",
      env: "staging",
    })
    mockGetCurrentEmissionState.mockReturnValue({
      authenticationToken: "mock-auth-token",
      userAgent: "mock-user-agent",
    })
    mockGetDeviceId.mockReturnValue("mock-device-id")
    mockGetDeviceNameSync.mockReturnValue("Mock Device")
  })

  describe("saveToken", () => {
    afterEach(() => {
      AsyncStorage.clear()
    })

    it("should save token successfully in production", async () => {
      const mockToken = "new-mock-token"
      mockUnsafe__getEnvironment.mockReturnValue({
        gravityURL: "https://api.artsy.net",
        env: "production",
      })

      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ status: 200 }),
      })

      const result = await saveToken(mockToken)

      expect(result).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            name: "mock-device-id",
            token: mockToken,
            app_id: "net.artsy.artsy",
            platform: "android",
            production: true,
          }),
          headers: {
            "Content-Type": "application/json",
            "X-ACCESS-TOKEN": "mock-auth-token",
            "User-Agent": "mock-user-agent",
          },
        })
      )
    })

    it("should use test device name when __TEST__ is true", async () => {
      const mockToken = "test-token"

      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ status: 200 }),
      })

      await saveToken(mockToken)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.stringContaining('"name":"mock-device-id"'),
        })
      )
    })

    it("should use device name sync when device id is null", async () => {
      const mockToken = "test-token"
      mockGetDeviceId.mockReturnValue(null)

      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ status: 200 }),
      })

      await saveToken(mockToken)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.stringContaining('"name":"Mock Device"'),
        })
      )
    })

    it("should handle API error response", async () => {
      const mockToken = "error-token"

      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ status: 400, error: "Bad request" }),
      })

      const result = await saveToken(mockToken)

      expect(result).toBe(false)
    })

    it("should handle response with error field but no status", async () => {
      const mockToken = "error-field-token"

      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ error: "Something went wrong" }),
      })

      const result = await saveToken(mockToken)

      expect(result).toBe(false)
    })

    it("should handle network error", async () => {
      const mockToken = "network-error-token"
      const mockError = new Error("Network error")

      mockFetch.mockRejectedValue(mockError)

      const result = await saveToken(mockToken)

      expect(result).toBe(false)
    })

    it("should handle staging environment as non-production", async () => {
      const mockToken = "staging-token"
      mockUnsafe__getEnvironment.mockReturnValue({
        gravityURL: "https://api.artsy.net",
        env: "staging",
      })

      mockFetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({ status: 200 }),
      })

      await saveToken(mockToken)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.stringContaining('"production":false'),
        })
      )
    })

    it("should not save token when it is different from the last token", async () => {
      const mockToken = "old-mock-token"

      jest.spyOn(AsyncStorage, "getItem").mockResolvedValueOnce("old-mock-token")

      const result = await saveToken(mockToken)

      expect(mockFetch).not.toHaveBeenCalled()

      expect(result).toBe(true)
    })
  })
})
