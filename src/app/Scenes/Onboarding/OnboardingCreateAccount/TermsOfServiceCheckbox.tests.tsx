import { fireEvent, screen } from "@testing-library/react-native"
import { TermsOfServiceCheckbox } from "app/Scenes/Onboarding/OnboardingCreateAccount/TermsOfServiceCheckbox"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("TermsOfServiceCheckbox", () => {
  it("displays a disclaimer", () => {
    renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)
    expect(screen.getByTestId("disclaimer")).toHaveTextContent(
      "By checking this box, you consent to our Terms of Use, Privacy Policy, and Conditions of Sale."
    )
  })

  it("navigates to the terms of use", () => {
    renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)
    fireEvent.press(screen.getByText("Terms of Use"))
    expect(navigateMock).toHaveBeenCalledWith("OnboardingWebView", { url: "/terms" })
  })

  it("navigates to the privacy policy", () => {
    renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)
    fireEvent.press(screen.getByText("Privacy Policy"))
    expect(navigateMock).toHaveBeenCalledWith("OnboardingWebView", { url: "/privacy" })
  })

  it("navigates to the conditions of sale", () => {
    renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)
    fireEvent.press(screen.getByText("Conditions of Sale"))
    expect(navigateMock).toHaveBeenCalledWith("OnboardingWebView", { url: "/conditions-of-sale" })
  })

  describe("when AREnableNewTermsAndConditions is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewTermsAndConditions: true })
    })

    it("displays a disclaimer", () => {
      renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)

      expect(screen.getByTestId("disclaimer")).toHaveTextContent(
        "I accept Artsy's General Terms and Conditions of Sale and Privacy Policy."
      )
    })

    it("navigates to the terms of use", () => {
      renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)
      fireEvent.press(screen.getByText("General Terms and Conditions of Sale"))
      expect(navigateMock).toHaveBeenCalledWith("OnboardingWebView", { url: "/terms" })
    })

    it("navigates to the privacy policy", () => {
      renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)
      fireEvent.press(screen.getByText("Privacy Policy"))
      expect(navigateMock).toHaveBeenCalledWith("OnboardingWebView", { url: "/privacy" })
    })
  })
})

const navigateMock = jest.fn()
const initialProps = {
  checked: false,
  error: false,
  setChecked: jest.fn(),
  navigation: {
    navigate: navigateMock,
  } as any,
}
