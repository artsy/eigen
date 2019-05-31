import React from "react"
import * as renderer from "react-test-renderer"

import { BidGhostButton } from "lib/Components/Bidding/Components/Button"
import { RegistrationResult, RegistrationStatus } from "../RegistrationResult"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  dismissModalViewController: jest.fn(),
  presentModalViewController: jest.fn(),
}))
import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { Theme } from "@artsy/palette"

describe("Registration result component", () => {
  it("renders registration pending properly", () => {
    const component = renderer
      .create(
        <Theme>
          <RegistrationResult status={RegistrationStatus.RegistrationStatusPending} />
        </Theme>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })
  it("renders registration complete properly", () => {
    const component = renderer
      .create(
        <Theme>
          <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
        </Theme>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })
  it("renders registration error properly", () => {
    const component = renderer
      .create(
        <Theme>
          <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
        </Theme>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })

  it("dismisses the controller when the continue button is pressed", () => {
    jest.useFakeTimers()
    const component = renderer.create(
      <Theme>
        <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
      </Theme>
    )
    const mockDismiss = SwitchBoard.dismissModalViewController as jest.Mock<any>
    mockDismiss.mockReturnValueOnce(Promise.resolve())

    component.root.findByType(BidGhostButton).instance.props.onPress()
    jest.runAllTicks()

    expect(SwitchBoard.dismissModalViewController).toHaveBeenCalled()
    expect(SwitchBoard.presentModalViewController).not.toHaveBeenCalled()
  })
})
