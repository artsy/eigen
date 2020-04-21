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
import { extractText } from "lib/tests/extractText"
import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"
import { Icon20 } from "../../Components/Icon"

describe("Registration result component", () => {
  it("renders registration pending properly", () => {
    const tree = renderer.create(
      <BiddingThemeProvider>
        <RegistrationResult status={RegistrationStatus.RegistrationStatusPending} needsIdentityVerification={false} />
      </BiddingThemeProvider>
    )
    expect(extractText(tree.root)).toMatch("Registration pending")
    expect(extractText(tree.root)).toMatch(
      "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email "
    )
    expect(extractText(tree.root)).not.toMatch("This auction requires Artsy to verify your identity before bidding.")
  })

  it("renders registration pending with an explanation about IDV", () => {
    const tree = renderer.create(
      <BiddingThemeProvider>
        <RegistrationResult status={RegistrationStatus.RegistrationStatusPending} needsIdentityVerification />
      </BiddingThemeProvider>
    )

    expect(extractText(tree.root)).toMatch("Registration pending")
    expect(extractText(tree.root)).toMatch("This auction requires Artsy to verify your identity before bidding.")
    expect(extractText(tree.root)).not.toMatch(
      "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email "
    )
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
    const tree = renderer.create(
      <BiddingThemeProvider>
        <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
      </BiddingThemeProvider>
    )
    expect(extractText(tree.root)).toMatch("Registration complete")
  })

  it("renders registration error properly", () => {
    const tree = renderer.create(
      <BiddingThemeProvider>
        <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
      </BiddingThemeProvider>
    )

    expect(extractText(tree.root)).toMatch("An error occurred")
    expect(extractText(tree.root)).toMatch("Please contact")
    expect(extractText(tree.root)).toMatch("with any questions.")
  })

  it("renders an error screen when the status is a network error", () => {
    const tree = renderer.create(
      <BiddingThemeProvider>
        <RegistrationResult status={RegistrationStatus.RegistrationStatusNetworkError} />
      </BiddingThemeProvider>
    )

    expect(extractText(tree.root)).toMatch("An error occurred")
    expect(extractText(tree.root)).toMatch("Please\ncheck your internet connection\nand try again.")
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
