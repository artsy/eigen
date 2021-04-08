import { Input } from "lib/Components/Input/Input"
import React from "react"
import { act } from "react-test-renderer"
import { renderWithWrappers } from "../../../tests/renderWithWrappers"
import { OnboardingForgotPassword } from "../OnboardingForgotPassword"

const navigateMock = jest.fn()

const navigationPropsMock = {
  navigate: navigateMock,
  goBack: jest.fn(),
}

describe("OnboardingForgotPassword", () => {
  const TestProvider = () => {
    return <OnboardingForgotPassword navigation={navigationPropsMock as any} route={null as any} />
  }

  it("renders reset button disabled initially", () => {
    const tree = renderWithWrappers(<TestProvider />)
    const resetButton = tree.root.findByProps({ testID: "resetButton" })
    expect(resetButton.props.disabled).toEqual(true)
  })

  // it("enables the reset button for a valid email", async () => {
  //   const tree = renderWithWrappers(<TestProvider />)

  //   const emailInput = tree.root.findByType(Input)

  //   act(() => {
  //     emailInput.props.onChangeText("example@mail.com")
  //     emailInput.props.onBlur()
  //   })

  //   const resetButton = tree.root.findByProps({ testID: "resetButton" })
  //   expect(resetButton.props.disabled).toEqual(false)
  // })

  // it("disables the reset button for invalid emails", async () => {
  //   const tree = renderWithWrappers(<TestProvider />)

  //   const emailInput = tree.root.findByType(Input)
  //   act(() => {
  //     emailInput.props.onChangeText("some")
  //     emailInput.props.onBlur()
  //   })

  //   const resetButton = tree.root.findByProps({ testID: "resetButton" })
  //   expect(resetButton.props.disabled).toEqual(true)
  // })
})
