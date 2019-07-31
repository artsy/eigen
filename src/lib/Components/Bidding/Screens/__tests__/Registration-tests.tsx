import { Button, Sans, Serif } from "@artsy/palette"
import { Registration_sale } from "__generated__/Registration_sale.graphql"
import React from "react"
import { NativeModules, Text, TouchableWithoutFeedback } from "react-native"
import * as renderer from "react-test-renderer"
import { BidInfoRow } from "../../Components/BidInfoRow"
import { Checkbox } from "../../Components/Checkbox"
import { BillingAddress } from "../BillingAddress"
import { CreditCardForm } from "../CreditCardForm"
import { Registration } from "../Registration"

// FIXME: Uncomment when x'd test is reenabled
// import { LinkText } from "../../../Text/LinkText"

import { mockTimezone } from "lib/tests/mockTimezone"

jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { metaphysics } from "../../../../metaphysics"
const mockphysics = metaphysics as jest.Mock<any>

// This lets us import the actual react-relay module, and replace specific functions within it with mocks.
jest.unmock("react-relay")
import relay from "react-relay"

const commitMutationMock = (fn?: typeof relay.commitMutation) =>
  jest.fn<typeof relay.commitMutation, Parameters<typeof relay.commitMutation>>(fn as any)

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))
import { RegistrationResult, RegistrationStatus } from "lib/Components/Bidding/Screens/RegistrationResult"
import { Modal } from "lib/Components/Modal"
import stripe from "tipsi-stripe"
import { Address } from "../../types"

import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"

let nextStep
const mockNavigator = { push: route => (nextStep = route), pop: () => null }
jest.useFakeTimers()
const mockPostNotificationName = jest.fn()

beforeEach(() => {
  Date.now = jest.fn(() => 1525983752116)
  mockTimezone("America/New_York")

  // Because of how we mock metaphysics, the mocked value from one test can bleed into another.
  mockphysics.mockReset()
  mockPostNotificationName.mockReset()

  NativeModules.ARNotificationsManager = { postNotificationName: mockPostNotificationName }
})

it("renders properly for a user without a credit card", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Registration {...initialPropsForUserWithoutCreditCard} />
    </BiddingThemeProvider>
  )

  expect(component.toJSON()).toMatchSnapshot()
  expect(component.root.findAllByType(Sans)[4].props.children).toEqual("A valid credit card is required for bidding.")
})

it("renders properly for a user with a credit card", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Registration {...initialPropsForUserWithCreditCard} />
    </BiddingThemeProvider>
  )

  expect(component.toJSON()).toMatchSnapshot()
  expect(component.root.findAllByType(Sans)[2].props.children).toEqual(
    "To complete your registration, please confirm that you agree to the Conditions of Sale."
  )
})

it("shows the billing address that the user typed in the billing address form", () => {
  const billingAddressRow = renderer
    .create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )
    .root.findAllByType(BidInfoRow)[1]
  billingAddressRow.instance.props.onPress()
  expect(nextStep.component).toEqual(BillingAddress)

  nextStep.passProps.onSubmit(billingAddress)

  expect(billingAddressRow.findAllByType(Serif)[1].props.children).toEqual("401 Broadway 25th floor New York NY")
})

it("shows the credit card form when the user tap the edit text in the credit card row", () => {
  const creditcardRow = renderer
    .create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )
    .root.findAllByType(BidInfoRow)[0]

  creditcardRow.instance.props.onPress()

  expect(nextStep.component).toEqual(CreditCardForm)
})

it("shows the option for entering payment information if the user does not have a credit card on file", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Registration {...initialPropsForUserWithoutCreditCard} />
    </BiddingThemeProvider>
  )

  expect(component.root.findAllByType(Checkbox).length).toEqual(1)
  expect(component.root.findAllByType(BidInfoRow).length).toEqual(2)
})

it("shows no option for entering payment information if the user has a credit card on file", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <Registration {...initialPropsForUserWithCreditCard} />
    </BiddingThemeProvider>
  )

  expect(component.root.findAllByType(Checkbox).length).toEqual(1)
  expect(component.root.findAllByType(BidInfoRow).length).toEqual(0)
})

describe("when pressing register button", () => {
  it("when a credit card needs to be added, it commits two mutations on button press", async () => {
    relay.commitMutation = commitMutationMock()
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.updateMyUserProfile, null)
        return null
      })
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.creatingCreditCardSuccess, null)
        return null
      })
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.qualifiedBidder, null)
        return null
      }) as any
    mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.qualifiedBidder))

    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )
    component.root
      .findByType(Registration)
      .instance.setState({ conditionsOfSaleChecked: true, billingAddress, creditCardToken: stripeToken })

    await component.root.findAllByType(Button)[1].instance.props.onPress()
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
    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithCreditCard} />
      </BiddingThemeProvider>
    )
    component.root.findByType(Registration).instance.setState({ conditionsOfSaleChecked: true })

    mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.qualifiedBidder))

    relay.commitMutation = jest.fn()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    expect(relay.commitMutation).toHaveBeenCalled()
  })

  it("disables tap events while a spinner is being shown", () => {
    const navigator = { push: jest.fn() } as any
    relay.commitMutation = jest.fn()

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} navigator={navigator} />
      </BiddingThemeProvider>
    )

    component.root.findByType(Registration).instance.setState({
      conditionsOfSaleChecked: true,
      creditCardToken: stripeToken,
      billingAddress,
    })

    component.root.findAllByType(Button)[1].instance.props.onPress()

    const yourMaxBidRow = component.root.findAllByType(TouchableWithoutFeedback)[0]
    const creditCardRow = component.root.findAllByType(TouchableWithoutFeedback)[1]
    const billingAddressRow = component.root.findAllByType(TouchableWithoutFeedback)[2]
    // const conditionsOfSaleLink = component.root.findByType(LinkText)
    const conditionsOfSaleCheckbox = component.root.findByType(Checkbox)

    yourMaxBidRow.instance.props.onPress()

    expect(navigator.push).not.toHaveBeenCalled()

    creditCardRow.instance.props.onPress()

    expect(navigator.push).not.toHaveBeenCalled()

    billingAddressRow.instance.props.onPress()

    expect(navigator.push).not.toHaveBeenCalled()
    // FIXME: Reenable
    // expect(conditionsOfSaleLink.instance.props.onPress).toBeNull()
    expect(conditionsOfSaleCheckbox.instance.props.disabled).toBeTruthy()
  })

  it("displays an error message on a stripe failure", () => {
    relay.commitMutation = jest
      .fn()
      .mockImplementationOnce((_, { onCompleted }) => onCompleted(mockRequestResponses.updateMyUserProfile))

    stripe.createTokenWithCard.mockImplementation(() => {
      throw new Error("Error tokenizing card")
    })
    console.error = jest.fn() // Silences component logging.
    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )

    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusError })
  })

  it("shows the error screen with the default error message if there are unhandled errors from the updateUserProfile mutation", () => {
    const errors = [{ message: "malformed error" }]

    console.error = jest.fn() // Silences component logging.
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted({}, errors)
      return null
    }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )

    // manually setting state to avoid duplicating tests for UI interaction, but practically better not to do so.
    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()

    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual(
      "There was a problem processing your information. Check your payment details and try again."
    )
    component.root
      .findByType(Modal)
      .findByType(Button)
      .props.onPress()

    // it dismisses the modal
    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("displays an error message on a updateUserProfile failure", () => {
    console.error = jest.fn() // Silences component logging.

    const errors = [{ message: "There was an error with your request" }]
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted({}, errors)
      return null
    }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )

    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()
    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual(
      "There was a problem processing your information. Check your payment details and try again."
    )
    component.root
      .findByType(Modal)
      .findByType(Button)
      .props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("shows the generic error screen on a updateUserProfile mutation network failure", () => {
    console.error = jest.fn() // Silences component logging.
    relay.commitMutation = jest
      .fn()
      .mockImplementationOnce((_, { onError }) => onError(new TypeError("Network request failed")))

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )

    // manually setting state to avoid duplicating tests for UI interaction, but practically better not to do so.
    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusNetworkError })
  })

  it("displays an error message on a creditCardMutation failure", () => {
    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
    relay.commitMutation = commitMutationMock()
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.updateMyUserProfile, null)
        return null
      })
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.creatingCreditCardError, null)
        return null
      }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )

    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()
    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual(
      "Your card's security code is incorrect."
    )
    component.root
      .findByType(Modal)
      .findByType(Button)
      .props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("shows the error screen with the default error message if there are unhandled errors from the createCreditCard mutation", () => {
    const errors = [{ message: "malformed error" }]

    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)

    relay.commitMutation = commitMutationMock()
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.updateMyUserProfile, null)
        return null
      })
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted({}, errors)
        return null
      }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )

    // manually setting state to avoid duplicating tests for UI interaction, but practically better not to do so.
    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()

    expect(component.root.findByType(Modal).findAllByType(Sans)[1].props.children).toEqual(
      "There was a problem processing your information. Check your payment details and try again."
    )
    component.root
      .findByType(Modal)
      .findByType(Button)
      .props.onPress()

    // it dismisses the modal
    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("shows the generic error screen on a createCreditCard mutation network failure", () => {
    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
    relay.commitMutation = commitMutationMock()
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.creatingCreditCardSuccess, null)
        return null
      })
      .mockImplementationOnce((_, { onError }) => {
        onError(new TypeError("Network request failed"))
        return null
      }) as any

    mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.qualifiedBidder))

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithoutCreditCard} />
      </BiddingThemeProvider>
    )
    component.root.findByType(Registration).instance.setState({ billingAddress })
    component.root.findByType(Registration).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusNetworkError })
  })

  it("displays an error message on a bidderMutation failure", () => {
    const error = {
      message:
        'https://stagingapi.artsy.net/api/v1/bidder?sale_id=leclere-impressionist-and-modern-art - {"error":"Invalid Sale"}',
    }

    console.error = jest.fn() // Silences component logging.
    relay.commitMutation = jest.fn().mockImplementation((_, { onCompleted }) => onCompleted({}, [error]))

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithCreditCard} />
      </BiddingThemeProvider>
    )

    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusError })
  })

  it("displays an error message on a network failure", () => {
    console.error = jest.fn() // Silences component logging.

    relay.commitMutation = commitMutationMock((_, { onError }) => {
      onError(new TypeError("Network request failed"))
      return null
    }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithCreditCard} />
      </BiddingThemeProvider>
    )

    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusNetworkError })
  })

  it("displays the pending result when the bidder is not qualified_for_bidding", () => {
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted({ createBidder: { bidder: { qualified_for_bidding: false } } }, null)
      return null
    }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithCreditCard} />
      </BiddingThemeProvider>
    )

    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()

    expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkRegistrationUpdated", {
      ARAuctionID: "sale-id",
    })

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusPending })
  })

  it("displays the completed result when the bidder is qualified_for_bidding", () => {
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted({ createBidder: { bidder: { qualified_for_bidding: true } } }, null)
      return null
    }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <Registration {...initialPropsForUserWithCreditCard} />
      </BiddingThemeProvider>
    )

    component.root.findByType(Checkbox).instance.props.onPress()
    component.root.findAllByType(Button)[1].instance.props.onPress()

    jest.runAllTicks()

    expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkRegistrationUpdated", {
      ARAuctionID: "sale-id",
    })

    expect(nextStep.component).toEqual(RegistrationResult)
    expect(nextStep.passProps).toEqual({ status: RegistrationStatus.RegistrationStatusComplete })
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
  tokenId: "fake-token",
  created: "1528229731",
  livemode: 0,
  card: {
    brand: "VISA",
    last4: "4242",
  },
  bankAccount: null,
  extra: null,
}

const sale: Partial<Registration_sale> = {
  slug: "sale-id",
  live_start_at: "2029-06-11T01:00:00+00:00",
  end_at: null,
  name: "Phillips New Now",
  start_at: "2018-06-11T01:00:00+00:00",
  is_preview: true,
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

const initialPropsForUserWithCreditCard = {
  ...initialProps,
  me: {
    has_credit_cards: true,
  },
} as any

const initialPropsForUserWithoutCreditCard = {
  ...initialProps,
  me: {
    has_credit_cards: false,
  },
} as any
