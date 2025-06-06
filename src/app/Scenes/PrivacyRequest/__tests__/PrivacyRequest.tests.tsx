import { fireEvent, screen } from "@testing-library/react-native"
import { PrivacyRequest } from "app/Scenes/PrivacyRequest/PrivacyRequest"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Linking } from "react-native"

describe("PrivacyRequest", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Linking, "openURL").mockImplementation(() => Promise.resolve())
  })

  it("handles privacy policy link taps", () => {
    renderWithWrappers(<PrivacyRequest />)

    fireEvent.press(screen.getByText("Privacy Policy"))

    expect(navigate).toHaveBeenCalledWith("/privacy")
  })

  it("handles email link taps", () => {
    renderWithWrappers(<PrivacyRequest />)
    fireEvent.press(screen.getByText("privacy@artsy.net."))

    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringMatching(/^mailto:privacy@artsy.net\?subject=Personal%20Data%20Request*$/)
    )
  })

  it("handles CCPA button presses", () => {
    renderWithWrappers(<PrivacyRequest />)

    fireEvent.press(screen.getByText("Do not sell my personal information"))

    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringMatching(
        /^mailto:privacy@artsy.net\?subject=Personal%20Data%20Request&body=Hello%2C%20I'm%20contacting%20you%20to%20ask%20that\.\.\.*$/
      )
    )
  })
})
