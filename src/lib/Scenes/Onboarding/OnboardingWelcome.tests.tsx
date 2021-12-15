import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { OnboardingWelcome } from "./OnboardingWelcome"

const navigateMock = jest.fn()

const navigationPropsMock = {
  navigate: navigateMock,
  addListener: jest.fn(),
}

describe("OnboardingWelcome", () => {
  describe("onboarding flow", () => {
    beforeEach(() => {
      navigateMock.mockReset()
    })

    it("navigates to create account screen when the user taps on create account", () => {
      const { getByTestId } = renderWithWrappersTL(
        <OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />
      )
      fireEvent.press(getByTestId("button-create"))
      expect(navigateMock).toHaveBeenCalledWith("OnboardingCreateAccount")
    })

    it("navigates to log in screen when the user taps on log in", () => {
      const { getByTestId } = renderWithWrappersTL(
        <OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />
      )
      fireEvent.press(getByTestId("button-login"))
      expect(navigateMock).toHaveBeenCalledWith("OnboardingLogin")
    })
  })
})
