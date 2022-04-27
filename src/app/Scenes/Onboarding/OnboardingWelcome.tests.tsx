import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockNavigate } from "app/tests/navigationMocks"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { OnboardingWelcome } from "./OnboardingWelcome"

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
      const { getByTestId } = renderWithWrappersTL(
        <OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />
      )
      fireEvent.press(getByTestId("button-create"))
      expect(mockNavigate).toHaveBeenCalledWith("OnboardingCreateAccount")
    })

    it("navigates to log in screen when the user taps on log in", () => {
      const { getByTestId } = renderWithWrappersTL(
        <OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />
      )
      fireEvent.press(getByTestId("button-login"))
      expect(mockNavigate).toHaveBeenCalledWith("OnboardingLogin")
    })
  })
})
