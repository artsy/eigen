import { Button, Checkbox, LinkText, Text } from "@artsy/palette-mobile"
import { createToken } from "@stripe/stripe-react-native"
import { fireEvent, screen } from "@testing-library/react-native"
import { Registration_me$data } from "__generated__/Registration_me.graphql"
import { Registration_sale$data } from "__generated__/Registration_sale.graphql"
import { BidInfoRow } from "app/Components/Bidding/Components/BidInfoRow"
import {
  RegistrationResult,
  RegistrationStatus,
} from "app/Components/Bidding/Screens/RegistrationResult"
import { Address } from "app/Components/Bidding/types"
import { Modal } from "app/Components/Modal"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { TouchableWithoutFeedback } from "react-native"
import relay from "react-relay"
import { CreditCardForm } from "./CreditCardForm"
import { Registration } from "./Registration"

const commitMutationMock = (fn?: typeof relay.commitMutation) =>
  jest.fn<typeof relay.commitMutation, Parameters<typeof relay.commitMutation>>(fn as any)

jest.mock("@stripe/stripe-react-native", () => ({
  createToken: jest.fn(),
}))

let nextStep: any
const mockNavigator = { push: (route: any) => (nextStep = route), pop: () => null }

const mockPostNotificationName = LegacyNativeModules.ARNotificationsManager.postNotificationName

it("renders properly for a user without a credit card", () => {
  renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

  expect(screen.getByText("A valid credit card is required.")).toBeOnTheScreen()
})

describe("User does not have a valid phone number", () => {
  it("renders properly for a user without a phone number", () => {
    renderWithWrappers(<Registration {...initialPropsForUserWithoutPhone} />)

    expect(screen.getByText("A valid phone number is required.")).toBeOnTheScreen()
  })
})

it("renders properly for a user with a credit card and phone", () => {
  renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

  expect(
    screen.getByText(
      "To complete your registration, please confirm that you agree to the Conditions of Sale."
    )
  ).toBeOnTheScreen()
})

it("renders properly for a verified user with a credit card and phone", () => {
  renderWithWrappers(
    <Registration
      {...initialProps}
      sale={{ ...sale, requireIdentityVerification: true }}
      me={{
        hasCreditCards: true,
        isIdentityVerified: true,
        phoneNumber: { isValid: true },
      }}
    />
  )

  expect(
    screen.getByText(
      "To complete your registration, please confirm that you agree to the Conditions of Sale."
    )
  ).toBeOnTheScreen()
  expect(screen.queryByText("valid phone number")).not.toBeOnTheScreen()
  expect(screen.queryByText("valid credit card")).not.toBeOnTheScreen()
})

it("shows the credit card form when the user tap the edit text in the credit card row", async () => {
  const { root } = renderWithWrappersLEGACY(
    <Registration {...initialPropsForUserWithoutCreditCardOrPhone} />
  )
  const creditCardRow = await root.findAllByType(BidInfoRow)

  creditCardRow[0].instance.props.onPress()

  expect(nextStep.component).toEqual(CreditCardForm)
})

it("shows the option for entering payment information if the user does not have a credit card on file", async () => {
  const { root } = renderWithWrappersLEGACY(
    <Registration {...initialPropsForUserWithoutCreditCardOrPhone} />
  )

  const checkboxes = await root.findAllByType(Checkbox)
  const bidInfoRows = await root.findAllByType(BidInfoRow)

  expect(checkboxes.length).toEqual(1)
  expect(bidInfoRows.length).toEqual(1)
})

it("shows no option for entering payment information if the user has a credit card on file", async () => {
  const { root } = renderWithWrappersLEGACY(
    <Registration {...initialPropsForUserWithCreditCardAndPhone} />
  )

  const checkboxes = await root.findAllByType(Checkbox)
  const bidInfoRows = await root.findAllByType(BidInfoRow)

  expect(checkboxes.length).toEqual(1)
  expect(bidInfoRows.length).toEqual(0)
})

describe("when the sale requires identity verification", () => {
  const propsWithIDVSale = {
    ...initialProps,
    sale: {
      ...sale,
      requireIdentityVerification: true,
    },
  }

  it("displays information about IDV if the user is not verified", async () => {
    const { root } = renderWithWrappersLEGACY(
      <Registration {...propsWithIDVSale} me={{ ...me, isIdentityVerified: false } as any} />
    )

    const text = await root.findAllByType(Text)

    expect(text.map(({ props }) => props.children)[4]).toEqual(
      "This auction requires Artsy to verify your identity before bidding."
    )
  })

  it("does not display information about IDV if the user is verified", async () => {
    const { root } = renderWithWrappersLEGACY(
      <Registration {...propsWithIDVSale} me={{ ...me, isIdentityVerified: true } as any} />
    )

    const text = await root.findAllByType(Text)

    expect(text.map(({ props }) => props.children)).not.toContain(
      "This auction requires Artsy to verify your identity before bidding."
    )
  })
})

describe("when pressing register button", () => {
  it("when a credit card needs to be added, it commits two mutations on button press", async () => {
    relay.commitMutation = commitMutationMock()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .mockImplementationOnce((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.updateMyUserProfile, null)
        return null
      })
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.creatingCreditCardSuccess, null)
        return null
      })
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.qualifiedBidder, null)
        return null
      }) as any
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    const { root } = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithoutCreditCardOrPhone} />
    )
    const registrationComponent = await root.findByType(Registration)
    registrationComponent.instance.setState({
      conditionsOfSaleChecked: true,
      billingAddress,
      creditCardToken: stripeToken.token,
    })

    const registerButton = await root.findByProps({ testID: "register-button" })
    await registerButton.props.onPress()

    expect(relay.commitMutation).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        variables: {
          input: {
            phone: "111 222 333",
          },
        },
      })
    )

    expect(relay.commitMutation).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        variables: {
          input: {
            token: "fake-token",
          },
        },
      })
    )

    expect(relay.commitMutation).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        variables: {
          input: {
            saleID: sale.slug,
          },
        },
      })
    )
  })

  it("when there is a credit card on file, it commits mutation", () => {
    const component = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithCreditCardAndPhone} />
    )
    component.root.findByType(Registration).instance.setState({ conditionsOfSaleChecked: true })

    relay.commitMutation = jest.fn()
    component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(relay.commitMutation).toHaveBeenCalled()
  })

  it("disables tap events while a spinner is being shown", async () => {
    const navigator = { push: jest.fn() } as any
    relay.commitMutation = jest.fn()

    const { root } = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithoutCreditCardOrPhone} navigator={navigator} />
    )

    const registrationComponent = await root.findByType(Registration)

    registrationComponent.instance.setState({
      conditionsOfSaleChecked: true,
      creditCardToken: stripeToken,
      billingAddress,
    })

    const registerButton = await root.findByProps({ testID: "register-button" })

    registerButton.props.onPress()

    const buttons = await root.findAllByType(TouchableWithoutFeedback)

    const yourMaxBidRow = buttons[0]
    const creditCardRow = buttons[1]
    const conditionsOfSaleLink = await root.findByType(LinkText)
    const conditionsOfSaleCheckbox = await root.findByType(Checkbox)

    fireEvent(yourMaxBidRow, "onPress")

    expect(navigator.push).not.toHaveBeenCalled()

    fireEvent(creditCardRow, "onPress")

    expect(navigator.push).not.toHaveBeenCalled()

    expect(conditionsOfSaleLink.props.onPress).toBeUndefined()
    expect(conditionsOfSaleCheckbox.props.disabled).toBeTruthy()
  })

  // skipping this test since we don't create a ticket on registration now
  xit("displays an error message on a stripe failure", async () => {
    relay.commitMutation = jest
      .fn()
      .mockImplementationOnce((_, { onCompleted }) =>
        onCompleted(mockRequestResponses.updateMyUserProfile)
      )
    ;(createToken as jest.Mock).mockImplementation(() => {
      throw new Error("Error tokenizing card")
    })
    console.error = jest.fn() // Silences component logging.
    const component = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithoutCreditCardOrPhone} />
    )

    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).props.onPress()
    await component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual([
      "There was a problem processing your information. Check your payment details and try again.",
    ])

    component.root.findByType(Modal).findByType(Button).props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("displays the default error message if there are unhandled errors from the updateUserProfile mutation", () => {
    const errors = [{ message: "malformed error" }]

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted({}, errors)
      return null
    }) as any

    const component = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithoutCreditCardOrPhone} />
    )

    // manually setting state to avoid duplicating tests for UI interaction, but practically better not to do so.
    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).props.onPress()
    component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual([
      "There was a problem processing your phone number, please try again.",
    ])
    component.root.findByType(Modal).findByType(Button).props.onPress()

    // it dismisses the modal
    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("displays an error message on a updateUserProfile failure", async () => {
    const errors = [{ message: "There was an error with your request" }]
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted({}, errors)
      return null
    }) as any

    const component = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithoutCreditCardOrPhone} />
    )

    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).props.onPress()
    await component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual([
      "There was a problem processing your phone number, please try again.",
    ])
    component.root.findByType(Modal).findByType(Button).props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("displays an error message on a updateUserProfile mutation network failure", () => {
    relay.commitMutation = jest
      .fn()
      .mockImplementationOnce((_, { onError }) => onError(new TypeError("Network request failed")))

    const component = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithoutCreditCardOrPhone} />
    )

    // manually setting state to avoid duplicating tests for UI interaction, but practically better not to do so.
    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).props.onPress()
    component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual([
      "There was a problem processing your phone number, please try again.",
    ])

    component.root.findByType(Modal).findByType(Button).props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("displays an error message on a creditCardMutation failure", async () => {
    renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)
    console.error = jest.fn() // Silences component logging.
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
    relay.commitMutation = commitMutationMock()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .mockImplementationOnce((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.updateMyUserProfile, null)
        return null
      })
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.creatingCreditCardError, null)
        return null
      }) as any

    // UNSAFELY getting the component instance to set state for testing purposes only
    screen.UNSAFE_getByType(Registration).instance.setState({ billingAddress })
    screen.UNSAFE_getByType(Registration).instance.setState({ creditCardToken: stripeToken })

    // Check the checkbox and press the Register button
    fireEvent.press(screen.UNSAFE_getByType(Checkbox))
    fireEvent.press(screen.getByTestId("register-button"))

    // Wait for the error modal to be displayed
    await screen.findByText("Your card's security code is incorrect.")
    expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", true)

    // press the dismiss modal button
    fireEvent.press(screen.getByText("Ok"))

    // error modal is dismissed
    expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", false)
  })

  it("displays the default error message if there are unhandled errors from the createCreditCard mutation", async () => {
    renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

    const errors = [{ message: "malformed error" }]

    console.error = jest.fn() // Silences component logging.
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    relay.commitMutation = commitMutationMock()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .mockImplementationOnce((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.updateMyUserProfile, null)
        return null
      })
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.({}, errors)
        return null
      }) as any

    // UNSAFELY getting the component instance to set state for testing purposes only
    screen.UNSAFE_getByType(Registration).instance.setState({ billingAddress })
    screen.UNSAFE_getByType(Registration).instance.setState({ creditCardToken: stripeToken })

    // Check the checkbox and press the Register button
    fireEvent.press(screen.UNSAFE_getByType(Checkbox))
    fireEvent.press(screen.getByTestId("register-button"))

    // Wait for the error modal to be displayed
    await screen.findByText(
      "There was a problem processing your information. Check your payment details and try again."
    )
    expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", true)

    // press the dismiss modal button
    fireEvent.press(screen.getByText("Ok"))

    // error modal is dismissed
    expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", false)
  })

  it("displays an error message on a createCreditCard mutation network failure", async () => {
    renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)
    console.error = jest.fn() // Silences component logging.
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
    relay.commitMutation = commitMutationMock()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .mockImplementationOnce((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.creatingCreditCardSuccess, null)
        return null
      })
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      .mockImplementationOnce((_, { onError }) => {
        onError?.(new TypeError("Network request failed"))
        return null
      }) as any

    // UNSAFELY getting the component instance to set state for testing purposes only
    screen.UNSAFE_getByType(Registration).instance.setState({ billingAddress })
    screen.UNSAFE_getByType(Registration).instance.setState({ creditCardToken: stripeToken })

    // Check the checkbox and press the Register button
    fireEvent.press(screen.UNSAFE_getByType(Checkbox))
    fireEvent.press(screen.getByTestId("register-button"))

    // Wait for the error modal to be displayed
    await screen.findByText(
      "There was a problem processing your information. Check your payment details and try again."
    )
    expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", true)

    // press the dismiss modal button
    fireEvent.press(screen.getByText("Ok"))

    // error modal is dismissed
    expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", false)
  })

  it("displays an error message on a bidderMutation failure", async () => {
    const error = {
      message:
        'https://stagingapi.artsy.net/api/v1/bidder?sale_id=leclere-impressionist-and-modern-art - {"error":"Invalid Sale"}',
    }

    relay.commitMutation = jest
      .fn()
      .mockImplementation((_, { onCompleted }) => onCompleted({}, [error]))

    const component = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithCreditCardAndPhone} />
    )

    component.root.findByType(Checkbox).props.onPress()
    await component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual([
      "There was a problem processing your information. Check your payment details and try again.",
    ])

    component.root.findByType(Modal).findByType(Button).props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("displays an error message on a network failure", async () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onError }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onError(new TypeError("Network request failed"))
      return null
    }) as any

    const component = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithCreditCardAndPhone} />
    )

    component.root.findByType(Checkbox).props.onPress()
    await component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual([
      "There was a problem processing your information. Check your payment details and try again.",
    ])

    component.root.findByType(Modal).findByType(Button).props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("displays the pending result when the bidder is not qualified_for_bidding", () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted({ createBidder: { bidder: { qualified_for_bidding: false } } }, null)
      return null
    }) as any

    const component = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithCreditCardAndPhone} />
    )

    component.root.findByType(Checkbox).props.onPress()
    component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkRegistrationUpdated", {
      ARAuctionID: "sale-id",
    })

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({
      status: RegistrationStatus.RegistrationStatusPending,
      needsIdentityVerification: false,
    })
  })

  it("displays the pending result with needsIdentityVerification: true when the sale requires identity verification", () => {
    const propsWithIDVSale = {
      ...initialPropsForUserWithCreditCardAndPhone,
      sale: {
        ...sale,
        requireIdentityVerification: true,
      },
    }
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted({ createBidder: { bidder: { qualified_for_bidding: false } } }, null)
      return null
    }) as any

    const component = renderWithWrappersLEGACY(<Registration {...propsWithIDVSale} />)

    component.root.findByType(Checkbox).props.onPress()
    component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({
      status: RegistrationStatus.RegistrationStatusPending,
      needsIdentityVerification: true,
    })
  })

  it("displays the completed result when the bidder is qualified_for_bidding", () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted({ createBidder: { bidder: { qualified_for_bidding: true } } }, null)
      return null
    }) as any

    const component = renderWithWrappersLEGACY(
      <Registration {...initialPropsForUserWithCreditCardAndPhone} />
    )

    component.root.findByType(Checkbox).props.onPress()
    component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkRegistrationUpdated", {
      ARAuctionID: "sale-id",
    })

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({
      status: RegistrationStatus.RegistrationStatusComplete,
      needsIdentityVerification: false,
    })
  })

  it("displays the completed result when the bidder is not verified but qualified for bidding", () => {
    const propsWithIDVSale = {
      ...initialPropsForUserWithCreditCardAndPhone,
      sale: {
        ...sale,
        requireIdentityVerification: true,
      },
    }

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted({ createBidder: { bidder: { qualified_for_bidding: true } } }, null)
      return null
    }) as any

    const component = renderWithWrappersLEGACY(<Registration {...propsWithIDVSale} />)

    component.root.findByType(Checkbox).props.onPress()
    component.root.findByProps({ testID: "register-button" }).props.onPress()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps.status).toEqual(RegistrationStatus.RegistrationStatusComplete)
  })
})

it("shows a checkbox for agreeing to the conditions of sale", () => {
  __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewTermsAndConditions: false })
  renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

  expect(
    screen.getByText(
      "I agree to the Conditions of Sale. I understand that all bids are binding and may not be retracted."
    )
  ).toBeOnTheScreen()
})

it("navigates to the conditions of sale when the user taps the link", () => {
  __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewTermsAndConditions: false })
  jest.mock("app/system/navigation/navigate", () => ({
    ...jest.requireActual("app/system/navigation/navigate"),
    navigate: jest.fn(),
  }))

  renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

  fireEvent.press(screen.getByText("Conditions of Sale"))

  expect(navigate).toHaveBeenCalledWith("/conditions-of-sale")
})

describe("when AREnableNewTermsAndConditions is enabled", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewTermsAndConditions: true })
  })

  it("shows a checkbox for agreeing to the conditions of sale", () => {
    renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

    expect(
      screen.getByText(
        "I agree to Artsy's General Terms and Conditions of Sale. I understand that all bids are binding and may not be retracted."
      )
    ).toBeOnTheScreen()
  })

  it("navigates to the terms when the user taps the link", () => {
    jest.mock("app/system/navigation/navigate", () => ({
      ...jest.requireActual("app/system/navigation/navigate"),
      navigate: jest.fn(),
    }))

    renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

    fireEvent.press(screen.getByText("General Terms and Conditions of Sale"))

    expect(navigate).toHaveBeenCalledWith("/terms")
  })
})

const billingAddress: Partial<Address> = {
  fullName: "Yuki Stockmeier",
  addressLine1: "401 Broadway",
  addressLine2: "25th floor",
  city: "New York",
  state: "NY",
  postalCode: "10013",
  phoneNumber: "111 222 333",
  country: {
    longName: "United States",
    shortName: "US",
  },
}

const stripeToken = {
  token: {
    id: "fake-token",
    created: "1528229731",
    livemode: 0,
    card: {
      brand: "VISA",
      last4: "4242",
    },
    bankAccount: null,
    extra: null,
  },
}

const sale: Partial<Registration_sale$data> = {
  slug: "sale-id",
  liveStartAt: "2029-06-11T01:00:00+00:00",
  endAt: null,
  name: "Phillips New Now",
  startAt: "2018-06-11T01:00:00+00:00",
  isPreview: true,
  requireIdentityVerification: false,
}

const mockRequestResponses = {
  updateMyUserProfile: {
    updateMyUserProfile: {
      user: {
        phone: "111 222 4444",
      },
    },
  },
  qualifiedBidder: {
    createBidder: {
      bidder: {
        qualified_for_bidding: true,
      },
    },
  },
  creatingCreditCardSuccess: {
    createCreditCard: {
      creditCardOrError: {
        creditCard: {
          id: "new-credit-card",
        },
      },
    },
  },
  creatingCreditCardError: {
    createCreditCard: {
      creditCardOrError: {
        mutationError: {
          detail: "Your card's security code is incorrect.",
          message: "Payment information could not be processed.",
          type: "payment_error",
        },
      },
    },
  },
}

const initialProps = {
  sale,
  relay: { environment: null },
  navigator: mockNavigator,
} as any

const me: Partial<Registration_me$data> = {
  hasCreditCards: false,
  isIdentityVerified: false,
  phoneNumber: {
    isValid: false,
    display: null,
  },
}

const initialPropsForUserWithCreditCardAndPhone = {
  ...initialProps,
  me: {
    ...me,
    hasCreditCards: true,
    phoneNumber: {
      isValid: true,
    },
  },
} as any

const initialPropsForUserWithoutPhone = {
  ...initialPropsForUserWithCreditCardAndPhone,
  me: {
    ...me,
    hasCreditCards: true,
    phoneNumber: { isValid: false },
  },
}

const initialPropsForUserWithoutCreditCardOrPhone = { ...initialProps, me } as any
