import { fireEvent, screen } from "@testing-library/react-native"
import { ForceUpdate } from "app/Scenes/ForceUpdate/ForceUpdate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Linking, Platform } from "react-native"

jest.mock("react-native-device-info", () => ({
  getVersion: jest.fn(() => "1.0.0"),
  isTablet: jest.fn(() => false),
}))

jest.mock("app/utils/appVersion", () => ({
  getBuildNumber: jest.fn(() => "123"),
  getAppVersion: jest.fn(() => "1.0.0"),
}))
jest.mock("app/utils/jsonFiles", () => ({
  appJson: jest.fn(() => ({ version: "1.0.0" })),
  echoLaunchJson: jest.fn(() => ({})),
}))

const mockUseIsStaging = jest.fn()
jest.mock("app/utils/hooks/useIsStaging", () => ({
  useIsStaging: () => mockUseIsStaging(),
}))

describe("ForceUpdate", () => {
  const mockOpenURL = jest.fn()
  const mockCanOpenURL = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockCanOpenURL.mockResolvedValue(true)
    Linking.openURL = mockOpenURL
    Linking.canOpenURL = mockCanOpenURL
  })

  describe("rendering", () => {
    beforeEach(() => {
      mockUseIsStaging.mockReturnValue(false)
    })

    it("renders the force update message", () => {
      const testMessage = "A new version is available. Please update to continue."

      renderWithWrappers(<ForceUpdate forceUpdateMessage={testMessage} />)

      expect(screen.getByText(testMessage)).toBeOnTheScreen()
    })

    it("renders the Update Artsy button", () => {
      renderWithWrappers(<ForceUpdate forceUpdateMessage="Please update" />)

      expect(screen.getByText("Update Artsy")).toBeOnTheScreen()
    })

    it("does not render staging info when not in staging", () => {
      mockUseIsStaging.mockReturnValue(false)

      renderWithWrappers(<ForceUpdate forceUpdateMessage="Please update" />)

      expect(screen.queryByText(/DeviceInfo Version:/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/AppJson version:/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Build Number:/)).not.toBeOnTheScreen()
    })
  })

  describe("staging environment", () => {
    beforeEach(() => {
      mockUseIsStaging.mockReturnValue(true)
    })

    it("renders staging debug information when in staging", () => {
      renderWithWrappers(<ForceUpdate forceUpdateMessage="Please update" />)

      expect(screen.getByText("DeviceInfo Version: 1.0.0")).toBeOnTheScreen()
      expect(screen.getByText("AppJson version: 1.0.0")).toBeOnTheScreen()
      expect(screen.getByText("Build Number: 123")).toBeOnTheScreen()
      expect(screen.getByText("getAppVersion: 1.0.0")).toBeOnTheScreen()
    })
  })

  describe("update button behavior", () => {
    it("opens the App Store URL on iOS when Update button is pressed", async () => {
      Platform.OS = "ios"

      renderWithWrappers(<ForceUpdate forceUpdateMessage="Please update" />)

      fireEvent.press(screen.getByText("Update Artsy"))

      expect(mockCanOpenURL).toHaveBeenCalledWith(
        "https://apps.apple.com/us/app/artsy-buy-sell-original-art/id703796080"
      )

      await Promise.resolve()

      expect(mockOpenURL).toHaveBeenCalledWith(
        "https://apps.apple.com/us/app/artsy-buy-sell-original-art/id703796080"
      )
    })

    it("opens the Play Store URL on Android when Update button is pressed", async () => {
      Platform.OS = "android"

      renderWithWrappers(<ForceUpdate forceUpdateMessage="Please update" />)

      fireEvent.press(screen.getByText("Update Artsy"))

      expect(mockCanOpenURL).toHaveBeenCalledWith(
        "https://play.google.com/store/apps/details?id=net.artsy.app"
      )

      await Promise.resolve()

      expect(mockOpenURL).toHaveBeenCalledWith(
        "https://play.google.com/store/apps/details?id=net.artsy.app"
      )
    })

    it("does not open URL when canOpenURL returns false", async () => {
      mockCanOpenURL.mockResolvedValue(false)

      renderWithWrappers(<ForceUpdate forceUpdateMessage="Please update" />)

      fireEvent.press(screen.getByText("Update Artsy"))

      await Promise.resolve()

      expect(mockOpenURL).not.toHaveBeenCalled()
    })

    it("handles errors when checking if URL can be opened", async () => {
      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation()
      const testError = new Error("Cannot open URL")
      mockCanOpenURL.mockRejectedValue(testError)

      renderWithWrappers(<ForceUpdate forceUpdateMessage="Please update" />)

      fireEvent.press(screen.getByText("Update Artsy"))

      await Promise.resolve()

      expect(consoleLogSpy).toHaveBeenCalledWith(testError)
    })
  })

  describe("edge cases", () => {
    it("renders correctly when forceUpdateMessage is undefined", () => {
      renderWithWrappers(<ForceUpdate forceUpdateMessage={undefined} />)

      expect(screen.getByText("Update Artsy")).toBeOnTheScreen()
    })

    it("renders correctly with empty string message", () => {
      renderWithWrappers(<ForceUpdate forceUpdateMessage="" />)

      expect(screen.getByText("Update Artsy")).toBeOnTheScreen()
    })
  })
})
