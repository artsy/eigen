import { fireEvent } from "@testing-library/react-native"
import { OnboardingWelcome } from "app/Scenes/Onboarding/OnboardingWelcome"
import { mockNavigate } from "app/utils/tests/navigationMocks"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const navigationPropsMock = {
  navigate: mockNavigate,
  addListener: jest.fn(),
}

describe("OnboardingWelcome", () => {
  describe("onboarding flow", () => {
    beforeEach(() => {
      mockNavigate.mockReset()
    })

    it("navigates to create account screen when the user taps on create account", () => {
      const { getByTestId } = renderWithWrappers(
        <OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />
      )
      fireEvent.press(getByTestId("button-create"))
      expect(mockNavigate).toHaveBeenCalledWith("OnboardingCreateAccount")
    })

    it("navigates to log in screen when the user taps on log in", () => {
      const { getByTestId } = renderWithWrappers(
        <OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />
      )
      fireEvent.press(getByTestId("button-login"))
      expect(mockNavigate).toHaveBeenCalledWith("OnboardingLogin")
    })
  })
})
