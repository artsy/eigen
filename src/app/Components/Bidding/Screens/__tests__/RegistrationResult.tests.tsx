import { fireEvent, getDefaultNormalizer, screen, waitFor } from "@testing-library/react-native"
import {
  RegistrationResult,
  RegistrationStatus,
} from "app/Components/Bidding/Screens/RegistrationResult"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { dismissModal, navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

import { Linking } from "react-native"

describe("Registration result component", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableEnrichedMarkdown: false })
  })

  it("renders registration pending properly", () => {
    renderWithWrappers(
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
    expect(screen.getByText("Registration pending", { exact: false })).toBeOnTheScreen()
    expect(
      screen.getByText(
        "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email ",
        { exact: false }
      )
    ).toBeOnTheScreen()
    expect(
      screen.queryByText("This auction requires Artsy to verify your identity before bidding.", {
        exact: false,
      })
    ).not.toBeOnTheScreen()
  })

  it("renders registration pending with an explanation about IDV", () => {
    renderWithWrappers(
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

    expect(screen.getByText("Registration pending", { exact: false })).toBeOnTheScreen()
    expect(
      screen.getByText("This auction requires Artsy to verify your identity before bidding.", {
        exact: false,
      })
    ).toBeOnTheScreen()
    expect(
      screen.queryByText(
        "Artsy is reviewing your registration and you will receive an email when it has been confirmed. Please email ",
        { exact: false }
      )
    ).not.toBeOnTheScreen()
  })

  it("does not render the icon when the registration status is pending", () => {
    renderWithWrappers(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusPending } } as any}
      />
    )

    expect(screen.queryByTestId("registration-result-icon")).not.toBeOnTheScreen()
  })

  it("renders registration complete properly", () => {
    renderWithWrappers(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusComplete } } as any}
      />
    )
    expect(screen.getByText("Registration complete", { exact: false })).toBeOnTheScreen()
    expect(screen.getByTestId("registration-result-icon")).toBeOnTheScreen()
  })

  it("renders registration error properly", () => {
    renderWithWrappers(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusError } } as any}
      />
    )

    expect(screen.getByText("An error occurred", { exact: false })).toBeOnTheScreen()
    expect(screen.getByText("Please contact", { exact: false })).toBeOnTheScreen()
    expect(screen.getByText("with any questions.", { exact: false })).toBeOnTheScreen()
  })

  it("renders an error screen when the status is a network error", () => {
    renderWithWrappers(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusNetworkError } } as any}
      />
    )

    expect(screen.getByText("An error occurred", { exact: false })).toBeOnTheScreen()
    expect(
      screen.getByText("Please\ncheck your internet connection\nand try again.", {
        exact: false,
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeOnTheScreen()
  })

  it("renders registration error and mailto link properly", async () => {
    Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    Linking.openURL = jest.fn()

    renderWithWrappers(
      <RegistrationResult
        navigation={null!}
        route={{ params: { status: RegistrationStatus.RegistrationStatusError } } as any}
      />
    )

    fireEvent.press(screen.getByText("support@artsy.net"))
    await waitFor(() => expect(Linking.openURL).toBeCalledWith("mailto:support@artsy.net"))
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
