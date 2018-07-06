import React from "react"
import * as renderer from "react-test-renderer"

import { BidGhostButton } from "lib/Components/Bidding/Components/Button"
import { RegistrationResult, RegistrationStatus } from "../RegistrationResult"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  dismissModalViewController: jest.fn(),
  presentModalViewController: jest.fn(),
}))
import SwitchBoard from "lib/NativeModules/SwitchBoard"

describe("Registration result component", () => {
  it("renders registration pending properly", () => {
    const component = renderer
      .create(<RegistrationResult status={RegistrationStatus.RegistrationStatusPending} />)
      .toJSON()
    expect(component).toMatchSnapshot()
  })
  it("renders registration complete properly", () => {
    const component = renderer
      .create(<RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />)
      .toJSON()
    expect(component).toMatchSnapshot()
  })
  it("renders registration error properly", () => {
    const component = renderer
      .create(<RegistrationResult status={RegistrationStatus.RegistrationStatusError} />)
      .toJSON()
    expect(component).toMatchSnapshot()
  })

  it("dismisses the controller when the continue button is pressed", () => {
    jest.useFakeTimers()
    const component = renderer.create(<RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />)
    const mockDismiss = SwitchBoard.dismissModalViewController as jest.Mock<any>
    mockDismiss.mockReturnValueOnce(Promise.resolve())

    component.root.findByType(BidGhostButton).instance.props.onPress()
    jest.runAllTicks()

    expect(SwitchBoard.dismissModalViewController).toHaveBeenCalled()
    expect(SwitchBoard.presentModalViewController).not.toHaveBeenCalled()
  })
})
