import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { Button } from "palette/elements/Button/Button"
import React from "react"
import { renderWithWrappers } from "../../../tests/renderWithWrappers"
import { OnboardingWelcome } from "../OnboardingWelcome"

const navigateMock = jest.fn()

const navigationPropsMock = {
  navigate: navigateMock,
  addListener: jest.fn(),
}

describe("OnboardingWelcome", () => {
  describe("old flow", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewOnboardingFlow: false })
    })
    it("navigates to create account screen when the user taps on create account", () => {
      const tree = renderWithWrappers(<OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />)
      const createAccountButton = tree.root.findAllByType(Button)[0]
      createAccountButton.props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("OnboardingCreateAccountWithEmail")
    })

    it("navigates to log in screen when the user taps on log in", () => {
      const tree = renderWithWrappers(<OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />)
      const loginButton = tree.root.findAllByType(Button)[1]
      loginButton.props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("OnboardingCreateAccountWithEmail")
    })
  })

  describe("new flow", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewOnboardingFlow: true })
    })

    it("navigates to create account screen when the user taps on create account", () => {
      const tree = renderWithWrappers(<OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />)
      const createAccountButton = tree.root.findAllByType(Button)[0]
      createAccountButton.props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("OnboardingCreateAccountWithEmail")
    })

    it("navigates to log in screen when the user taps on log in", () => {
      const tree = renderWithWrappers(<OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />)
      const loginButton = tree.root.findAllByType(Button)[1]
      loginButton.props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("OnboardingCreateAccountWithEmail")
    })
  })
})
