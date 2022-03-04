import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"

import { Button, LinkText } from "palette"
import { RegistrationResult, RegistrationStatus } from "./RegistrationResult"

import { dismissModal, navigate } from "app/navigation/navigate"

import { Linking } from "react-native"

import { extractText } from "app/tests/extractText"
import { Icon20 } from "../Components/Icon"

describe("Registration result component", () => {
  it("renders registration pending properly", () => {
    const tree = renderWithWrappers(
      <RegistrationResult
        status={RegistrationStatus.RegistrationStatusPending}
        needsIdentityVerification={false}
      />
    )
    expect(extractText(tree.root)).toMatch("Registration pending")
    expect(extractText(tree.root)).toMatch(
      "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email "
    )
    expect(extractText(tree.root)).not.toMatch(
      "This auction requires Artsy to verify your identity before bidding."
    )
  })

  it("renders registration pending with an explanation about IDV", () => {
    const tree = renderWithWrappers(
      <RegistrationResult
        status={RegistrationStatus.RegistrationStatusPending}
        needsIdentityVerification
      />
    )

    expect(extractText(tree.root)).toMatch("Registration pending")
    expect(extractText(tree.root)).toMatch(
      "This auction requires Artsy to verify your identity before bidding."
    )
    expect(extractText(tree.root)).not.toMatch(
      "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email "
    )
  })

  it("does not render the icon when the registration status is pending", () => {
    const component = renderWithWrappers(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusPending} />
    )

    expect(component.root.findAllByType(Icon20).length).toEqual(0)
  })

  it("renders registration complete properly", () => {
    const tree = renderWithWrappers(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
    )
    expect(extractText(tree.root)).toMatch("Registration complete")
  })

  it("renders registration error properly", () => {
    const tree = renderWithWrappers(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
    )

    expect(extractText(tree.root)).toMatch("An error occurred")
    expect(extractText(tree.root)).toMatch("Please contact")
    expect(extractText(tree.root)).toMatch("with any questions.")
  })

  it("renders an error screen when the status is a network error", () => {
    const tree = renderWithWrappers(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusNetworkError} />
    )

    expect(extractText(tree.root)).toMatch("An error occurred")
    expect(extractText(tree.root)).toMatch("Please\ncheck your internet connection\nand try again.")
  })

  it("renders registration error and mailto link properly", async () => {
    Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    Linking.openURL = jest.fn()

    const component = renderWithWrappers(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
    )
    await component.root.findByType(LinkText).props.onPress()
    expect(Linking.openURL).toBeCalledWith("mailto:support@artsy.net")
  })

  it("dismisses the controller when the continue button is pressed", () => {
    jest.useFakeTimers()
    const component = renderWithWrappers(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
    )
    component.root.findByType(Button).props.onPress()
    jest.runAllTicks()

    expect(dismissModal).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
})
