import { LinkText } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { Icon20 } from "app/Components/Bidding/Components/Icon"
import {
  RegistrationResult,
  RegistrationStatus,
} from "app/Components/Bidding/Screens/RegistrationResult"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

import { Linking } from "react-native"

describe("Registration result component", () => {
  it("renders registration pending properly", () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult
        navigation={null!}
        route={
          {
            params: {
              status: RegistrationStatus.RegistrationStatusPending,
              needsIdentityVerification: false,
            },
          } as any
        }
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
        navigation={null!}
        route={
          {
            params: {
              status: RegistrationStatus.RegistrationStatusPending,
              needsIdentityVerification: true,
            },
          } as any
        }
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
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusPending } } as any}
      />
    )

    expect((await view.root.findAllByType(Icon20)).length).toEqual(0)
  })

  it("renders registration complete properly", () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusComplete } } as any}
      />
    )
    expect(extractText(view.root)).toMatch("Registration complete")
  })

  it("renders registration error properly", () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusError } } as any}
      />
    )

    expect(extractText(view.root)).toMatch("An error occurred")
    expect(extractText(view.root)).toMatch("Please contact")
    expect(extractText(view.root)).toMatch("with any questions.")
  })

  it("renders an error screen when the status is a network error", () => {
    const view = renderWithWrappersLEGACY(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusNetworkError } } as any}
      />
    )

    expect(extractText(view.root)).toMatch("An error occurred")
    expect(extractText(view.root)).toMatch("Please\ncheck your internet connection\nand try again.")
  })

  it("renders registration error and mailto link properly", async () => {
    Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    Linking.openURL = jest.fn()

    const view = renderWithWrappersLEGACY(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusError } } as any}
      />
    )

    const linkText = await view.root.findByType(LinkText)
    await linkText.props.onPress()
    expect(Linking.openURL).toBeCalledWith("mailto:support@artsy.net")
  })

  it("dismisses the controller when the continue button is pressed", () => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
    renderWithWrappers(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusComplete } } as any}
      />
    )

    fireEvent.press(screen.getByTestId("continue-button"))

    jest.runAllTicks()

    expect(dismissModal).toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })
})
