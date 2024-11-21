import { LinkText, Button } from "@artsy/palette-mobile"
import { Icon20 } from "app/Components/Bidding/Components/Icon"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

import { Linking } from "react-native"
import { RegistrationResult, RegistrationStatus } from "./RegistrationResult"

describe("Registration result component", () => {
  it("renders registration pending properly", () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult
        status={RegistrationStatus.RegistrationStatusPending}
        needsIdentityVerification={false}
      />
    )
    expect(extractText(view.root)).toMatch("Registration pending")
    expect(extractText(view.root)).toMatch(
      "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email "
    )
    expect(extractText(view.root)).not.toMatch(
      "This auction requires Artsy to verify your identity before bidding."
    )
  })

  it("renders registration pending with an explanation about IDV", () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult
        status={RegistrationStatus.RegistrationStatusPending}
        needsIdentityVerification
      />
    )

    expect(extractText(view.root)).toMatch("Registration pending")
    expect(extractText(view.root)).toMatch(
      "This auction requires Artsy to verify your identity before bidding."
    )
    expect(extractText(view.root)).not.toMatch(
      "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email "
    )
  })

  it("does not render the icon when the registration status is pending", async () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusPending} />
    )

    expect((await view.root.findAllByType(Icon20)).length).toEqual(0)
  })

  it("renders registration complete properly", () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
    )
    expect(extractText(view.root)).toMatch("Registration complete")
  })

  it("renders registration error properly", () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
    )

    expect(extractText(view.root)).toMatch("An error occurred")
    expect(extractText(view.root)).toMatch("Please contact")
    expect(extractText(view.root)).toMatch("with any questions.")
  })

  it("renders an error screen when the status is a network error", () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusNetworkError} />
    )

    expect(extractText(view.root)).toMatch("An error occurred")
    expect(extractText(view.root)).toMatch("Please\ncheck your internet connection\nand try again.")
  })

  it("renders registration error and mailto link properly", async () => {
    Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    Linking.openURL = jest.fn()

    const view = renderWithWrappersLEGACY(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusError} />
    )
    await (await view.root.findByType(LinkText)).props.onPress()
    expect(Linking.openURL).toBeCalledWith("mailto:support@artsy.net")
  })

  it("dismisses the controller when the continue button is pressed", async () => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    const view = renderWithWrappersLEGACY(
      <RegistrationResult status={RegistrationStatus.RegistrationStatusComplete} />
    )
    ;(await view.root.findByType(Button)).props.onPress()
    jest.runAllTicks()

    expect(dismissModal).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
})
