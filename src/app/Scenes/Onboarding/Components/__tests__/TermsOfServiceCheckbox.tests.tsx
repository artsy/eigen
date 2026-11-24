import { fireEvent, screen } from "@testing-library/react-native"
import { TermsOfServiceCheckbox } from "app/Scenes/Onboarding/Components/TermsOfServiceCheckbox"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("TermsOfServiceCheckbox", () => {
  it("displays a disclaimer", async () => {
    await renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)

    expect(screen.getByTestId("disclaimer")).toHaveTextContent(
      "I accept Artsy's General Terms and Conditions of Sale and Privacy Policy."
    )
  })

  it("navigates to the terms of use", async () => {
    await renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)
    await fireEvent.press(screen.getByText("General Terms and Conditions of Sale"))
    expect(navigateMock).toHaveBeenCalledWith("OnboardingWebView", { url: "/terms" })
  })

  it("navigates to the privacy policy", async () => {
    await renderWithWrappers(<TermsOfServiceCheckbox {...initialProps} />)
    await fireEvent.press(screen.getByText("Privacy Policy"))
    expect(navigateMock).toHaveBeenCalledWith("OnboardingWebView", { url: "/privacy" })
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
