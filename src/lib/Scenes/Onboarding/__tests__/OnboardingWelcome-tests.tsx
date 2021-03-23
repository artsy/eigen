import { Button } from "palette"
import React from "react"
import { renderWithWrappers } from "../../../tests/renderWithWrappers"
import { OnboardingWelcome } from "../OnboardingWelcome"

const navigateMock = jest.fn()

const navigationPropsMock = {
  navigate: navigateMock,
}

describe("OnboardingWelcome", () => {
  it("navigates to create account screen when the user taps on create account", () => {
    const tree = renderWithWrappers(<OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />)
    const createAccountButton = tree.root.findAllByType(Button)[0]
    createAccountButton.props.onPress()
    expect(navigateMock).toHaveBeenCalledWith("OnboardingCreateAccount")
  })

  it("navigates to log in screen when the user taps on log in", () => {
    const tree = renderWithWrappers(<OnboardingWelcome navigation={navigationPropsMock as any} route={null as any} />)
    const loginButton = tree.root.findAllByType(Button)[1]
    loginButton.props.onPress()
    expect(navigateMock).toHaveBeenCalledWith("OnboardingLogin")
  })
})
