import React from "react"
import * as renderer from "react-test-renderer"

import { Button } from "@artsy/palette"
import { RegistrationResult, RegistrationStatus } from "../RegistrationResult"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  dismissModalViewController: jest.fn(),
  presentModalViewController: jest.fn(),
}))
import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { Linking } from "react-native"

import { LinkText } from "lib/Components/Text/LinkText"
import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"
import { Icon20 } from "../../Components/Icon"

describe("Registration result component", () => {
  it("renders registration pending properly", () => {
    const component = renderer
      .create(
        <BiddingThemeProvider>
          <RegistrationResult status={RegistrationStatus.RegistrationStatusPending} />
        </BiddingThemeProvider>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })

  it("does not render the icon when the registration status is pending", () => {
    const component = renderer.create(
      <BiddingThemeProvider>
        <RegistrationResult status={RegistrationStatus.RegistrationStatusPending} />
      </BiddingThemeProvider>
    )

    expect(component.root.findAllByType(Icon20).length).toEqual(0)
  })

  it("renders registration complete properly", () => {
    const component = renderer
      .create(
        <BiddingThemeProvider>
          <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
        </BiddingThemeProvider>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })

  it("renders registration error properly", () => {
    const component = renderer
      .create(
        <BiddingThemeProvider>
          <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
        </BiddingThemeProvider>
      )
      .toJSON()
    expect(component).toMatchSnapshot()
  })

  it("renders registration error and mailto link properly", async () => {
    Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    Linking.openURL = jest.fn()

    const component = renderer.create(
      <BiddingThemeProvider>
        <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
      </BiddingThemeProvider>
    )
    await component.root.findByType(LinkText).props.onPress()
    expect(Linking.openURL).toBeCalledWith("mailto:support@artsy.net")
  })

  it("dismisses the controller when the continue button is pressed", () => {
    jest.useFakeTimers()
    const component = renderer.create(
      <BiddingThemeProvider>
        <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
      </BiddingThemeProvider>
    )
    const mockDismiss = SwitchBoard.dismissModalViewController as jest.Mock<any>
    mockDismiss.mockReturnValueOnce(Promise.resolve())

    component.root.findByType(Button).instance.props.onPress()
    jest.runAllTicks()

    expect(SwitchBoard.dismissModalViewController).toHaveBeenCalled()
    expect(SwitchBoard.presentModalViewController).not.toHaveBeenCalled()
  })
})
