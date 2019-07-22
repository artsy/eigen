import { Button, Serif } from "@artsy/palette"
import { merge, times } from "lodash"
import React from "react"
import { NativeModules, Text, TouchableWithoutFeedback } from "react-native"
import "react-native"
import * as renderer from "react-test-renderer"

import { LinkText } from "../../../Text/LinkText"
import { BidInfoRow } from "../../Components/BidInfoRow"
import { Checkbox } from "../../Components/Checkbox"

import { BidResultScreen } from "../BidResult"
import { BillingAddress } from "../BillingAddress"
import { ConfirmBid, ConfirmBidProps } from "../ConfirmBid"
import { CreditCardForm } from "../CreditCardForm"

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
import stripe from "tipsi-stripe"

import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"
import { ConfirmBidCreateBidderPositionMutationResponse } from "__generated__/ConfirmBidCreateBidderPositionMutation.graphql"
import { ConfirmBidCreateCreditCardMutationResponse } from "__generated__/ConfirmBidCreateCreditCardMutation.graphql"
import { ConfirmBidUpdateUserMutationResponse } from "__generated__/ConfirmBidUpdateUserMutation.graphql"
import { FakeNavigator } from "lib/Components/Bidding/__tests__/Helpers/FakeNavigator"
import { Modal } from "lib/Components/Modal"
import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"
import { Address } from "../../types"
import { SelectMaxBidEdit } from "../SelectMaxBidEdit"

let nextStep
const mockNavigator = { push: route => (nextStep = route) }
jest.useFakeTimers()
const mockPostNotificationName = jest.fn()

const findPlaceBidButton = component => {
  return component.root.findAllByType(Button)[1]
}

beforeEach(() => {
  nextStep = null // reset nextStep between tests
  // Because of how we mock metaphysics, the mocked value from one test can bleed into another.
  mockphysics.mockReset()
  mockPostNotificationName.mockReset()
  NativeModules.ARNotificationsManager = { postNotificationName: mockPostNotificationName }
})

it("renders properly", () => {
  const component = renderer
    .create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialProps} />
      </BiddingThemeProvider>
    )
    .toJSON()
  expect(component).toMatchSnapshot()
})

it("enables the bid button when checkbox is ticked", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <ConfirmBid {...initialProps} />
    </BiddingThemeProvider>
  )

  expect(findPlaceBidButton(component).props.onPress).toBeFalsy()

  component.root.findByType(Checkbox).props.onPress()

  expect(findPlaceBidButton(component).props.onPress).toBeDefined()
})

it("enables the bid button by default if the user is registered", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <ConfirmBid {...initialPropsForRegisteredUser} />
    </BiddingThemeProvider>
  )

  expect(findPlaceBidButton(component).props.onPress).toBeDefined()
})

it("displays the artwork title correctly with date", () => {
  const component = renderer.create(
    <BiddingThemeProvider>
      <ConfirmBid {...initialProps} />
    </BiddingThemeProvider>
  )

  expect(serifChildren(component)).toContain(", 2015")
})

it("displays the artwork title correctly without date", () => {
  const datelessProps = merge({}, initialProps, { sale_artwork: { artwork: { date: null } } })
  const component = renderer.create(
    <BiddingThemeProvider>
      <ConfirmBid {...datelessProps} />
    </BiddingThemeProvider>
  )

  expect(serifChildren(component)).not.toContain(`${saleArtwork.artwork.title},`)
})

describe("checkbox and payment info display", () => {
  it("shows no checkbox or payment info if the user is registered", () => {
    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialPropsForRegisteredUser} />
      </BiddingThemeProvider>
    )

    expect(component.root.findAllByType(Checkbox).length).toEqual(0)
    expect(component.root.findAllByType(BidInfoRow).length).toEqual(1)

    const serifs = component.root.findAllByType(Serif)
    expect(serifs.find(s => s.props.children.join && s.props.children.join("").includes("You agree to"))).toBeTruthy()
  })

  it("shows a checkbox but no payment info if the user is not registered and has cc on file", () => {
    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialProps} />
      </BiddingThemeProvider>
    )

    expect(component.root.findAllByType(Checkbox).length).toEqual(1)
    expect(component.root.findAllByType(BidInfoRow).length).toEqual(1)
  })

  it("shows a checkbox and payment info if the user is not registered and has no cc on file", () => {
    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialPropsForUnqualifiedUser} />
      </BiddingThemeProvider>
    )

    expect(component.root.findAllByType(Checkbox).length).toEqual(1)
    expect(component.root.findAllByType(BidInfoRow).length).toEqual(3)
  })
})

describe("when pressing bid button", () => {
  it("commits mutation", () => {
    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialProps} />
      </BiddingThemeProvider>
    )
    component.root.findByType(Checkbox).props.onPress()

    relay.commitMutation = jest.fn()

    findPlaceBidButton(component).props.onPress()
    expect(relay.commitMutation).toHaveBeenCalled()
  })

  it("shows a spinner", () => {
    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialProps} />
      </BiddingThemeProvider>
    )
    component.root.findByType(Checkbox).props.onPress()
    relay.commitMutation = jest.fn()
    const placeBidButton = findPlaceBidButton(component)

    placeBidButton.props.onPress()

    expect(placeBidButton.props.loading).toEqual(true)
  })

  it("disables tap events while a spinner is being shown", () => {
    const navigator = { push: jest.fn() } as any
    relay.commitMutation = jest.fn()

    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialPropsForUnqualifiedUser} navigator={navigator} />
      </BiddingThemeProvider>
    )

    component.root.findByType(ConfirmBid).instance.setState({
      conditionsOfSaleChecked: true,
      creditCardToken: stripeToken,
      billingAddress,
    })

    findPlaceBidButton(component).props.onPress()

    const yourMaxBidRow = component.root.findAllByType(TouchableWithoutFeedback)[0]
    const creditCardRow = component.root.findAllByType(TouchableWithoutFeedback)[1]
    const billingAddressRow = component.root.findAllByType(TouchableWithoutFeedback)[2]
    const conditionsOfSaleLink = component.root.findByType(LinkText)
    const conditionsOfSaleCheckbox = component.root.findByType(Checkbox)

    yourMaxBidRow.instance.props.onPress()

    expect(navigator.push).not.toHaveBeenCalled()

    creditCardRow.instance.props.onPress()

    expect(navigator.push).not.toHaveBeenCalled()

    billingAddressRow.instance.props.onPress()

    expect(navigator.push).not.toHaveBeenCalled()
    expect(conditionsOfSaleLink.props.onPress).toBeNull()
    expect(conditionsOfSaleCheckbox.props.disabled).toBeTruthy()
  })

  describe("when pressing bid", () => {
    it("commits the mutation", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialProps} />
        </BiddingThemeProvider>
      )
      component.root.findByType(Checkbox).props.onPress()
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestBidder))
      relay.commitMutation = jest.fn()

      findPlaceBidButton(component).props.onPress()

      expect(relay.commitMutation).toHaveBeenCalled()
    })

    describe("when mutation fails", () => {
      it("does not verify bid position", () => {
        // Probably due to a network problem.
        const component = renderer.create(
          <BiddingThemeProvider>
            <ConfirmBid {...initialProps} />
          </BiddingThemeProvider>
        )
        component.root.findByType(Checkbox).props.onPress()
        console.error = jest.fn() // Silences component logging.
        relay.commitMutation = commitMutationMock((_, { onError }) => {
          onError(new Error("An error occurred."))
          return null
        }) as any

        findPlaceBidButton(component).props.onPress()

        expect(relay.commitMutation).toHaveBeenCalled()
        expect(mockphysics).not.toHaveBeenCalled()
      })

      it("displays an error message on a network failure", () => {
        const component = renderer.create(
          <BiddingThemeProvider>
            <ConfirmBid {...initialProps} />
          </BiddingThemeProvider>
        )
        component.root.findByType(Checkbox).props.onPress()
        console.error = jest.fn() // Silences component logging.

        // A TypeError is raised when the device has no internet connection.
        relay.commitMutation = commitMutationMock((_, { onError }) => {
          onError(new TypeError("Network request failed"))
          return null
        }) as any

        findPlaceBidButton(component).props.onPress()

        expect(nextStep.component).toEqual(BidResultScreen)
        expect(nextStep.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult: {
              message_header: "An error occurred",
              message_description_md:
                "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
            },
          })
        )
      })

      it("displays an error message on a createBidderPosition mutation failure", () => {
        const error = {
          message: 'GraphQL Timeout Error: Mutation.createBidderPosition has timed out after waiting for 5000ms"}',
        }

        relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
          onCompleted({}, [error])
          return null
        }) as any

        const component = renderer.create(
          <BiddingThemeProvider>
            <ConfirmBid {...initialProps} />
          </BiddingThemeProvider>
        )

        component.root.findByType(Checkbox).props.onPress()
        findPlaceBidButton(component).props.onPress()

        jest.runAllTicks()

        expect(nextStep.component).toEqual(BidResultScreen)
        expect(nextStep.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult: {
              message_header: "An error occurred",
              message_description_md:
                "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
            },
          })
        )
      })
    })
  })
})

describe("editing bid amount", () => {
  it("allows you to go to the max bid edit screen and select a new max bid", () => {
    const fakeNavigator = new FakeNavigator()
    const fakeNavigatorProps = {
      ...initialPropsForRegisteredUser,
      navigator: fakeNavigator,
    }
    fakeNavigator.push({ component: ConfirmBid, id: "", title: "", passProps: fakeNavigatorProps })

    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialPropsForRegisteredUser} navigator={fakeNavigator} />
      </BiddingThemeProvider>
    )

    const selectMaxBidRow = component.root.findAllByType(TouchableWithoutFeedback)[0]

    expect(selectMaxBidRow.findAllByType(Serif)[1].props.children).toEqual("$45,000")

    selectMaxBidRow.instance.props.onPress()

    const editScreen = fakeNavigator.nextStep().root.findByType(SelectMaxBidEdit)

    expect(editScreen.props.selectedBidIndex).toEqual(0)

    editScreen.instance.setState({ selectedBidIndex: 1 })
    editScreen.findByType(Button).props.onPress()

    const updatedBidRow = component.root.findAllByType(TouchableWithoutFeedback)[0]
    expect(updatedBidRow.findAllByType(Serif)[1].props.children).toEqual("$46,000")
  })
})

describe("polling to verify bid position", () => {
  describe("bid success", () => {
    it("polls for new results", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialProps} />
        </BiddingThemeProvider>
      )
      component.root.findByType(Checkbox).props.onPress()
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any
      let requestCounter = 0 // On the fifth attempt, return highestBidder
      mockphysics.mockImplementation(() => {
        requestCounter++
        if (requestCounter > 5) {
          return Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
        } else {
          return Promise.resolve(mockRequestResponses.pollingForBid.pending)
        }
      })

      findPlaceBidButton(component).props.onPress()
      times(6, () => {
        jest.runOnlyPendingTimers()
        jest.runAllTicks()
      })

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.highestBidder.data.me.bidder_position,
        })
      )
    })

    it("shows error when polling attempts exceed max", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialProps} />
        </BiddingThemeProvider>
      )
      component.root.findByType(Checkbox).props.onPress()
      mockphysics.mockReturnValue(Promise.resolve(mockRequestResponses.pollingForBid.pending))
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()

      times(22, () => {
        jest.runOnlyPendingTimers()
        jest.runAllTicks()
      })

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.pending.data.me.bidder_position,
        })
      )
    })

    it("shows successful bid result when highest bidder", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialProps} />
        </BiddingThemeProvider>
      )
      component.root.findByType(Checkbox).props.onPress()
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestBidder))
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      jest.runAllTicks() // Required as metaphysics async call defers execution to next invocation of Node event loop.

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.highestBidder.data.me.bidder_position,
        })
      )
    })

    it("shows outbid bidSuccessResult when outbid", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialProps} />
        </BiddingThemeProvider>
      )
      component.root.findByType(Checkbox).props.onPress()
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.outbid))
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      jest.runAllTicks()

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.outbid.data.me.bidder_position,
        })
      )
    })

    it("shows reserve not met when reserve is not met", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialProps} />
        </BiddingThemeProvider>
      )
      component.root.findByType(Checkbox).props.onPress()
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet))
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      jest.runAllTicks()

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          bidderPositionResult: mockRequestResponses.pollingForBid.reserveNotMet.data.me.bidder_position,
        })
      )
    })

    it("updates the main auction screen", () => {
      const mockedMockNavigator = { push: jest.fn() }
      const component = renderer.create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialProps} navigator={mockedMockNavigator as any} refreshSaleArtwork={jest.fn()} />
        </BiddingThemeProvider>
      )
      component.root.findByType(Checkbox).props.onPress()
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet))
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      jest.runAllTicks()

      expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkRegistrationUpdated", {
        ARAuctionID: "best-art-sale-in-town",
      })
      expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkBidUpdated", {
        ARAuctionID: "best-art-sale-in-town",
        ARAuctionArtworkID: "meteor-shower",
      })

      // navigates to bid result screen
      expect(mockedMockNavigator.push).toHaveBeenCalledWith({
        component: BidResultScreen,
        passProps: {
          bidderPositionResult: {
            position: {},
            status: "RESERVE_NOT_MET",
          },
          refreshBidderInfo: expect.anything(),
          refreshSaleArtwork: expect.anything(),
          sale_artwork: {
            internalID: "internal-id",
            " $fragmentRefs": null,
            " $refType": null,
            artwork: {
              artist_names: "Makiko Kudo",
              date: "2015",
              slug: "meteor-shower",
              title: "Meteor Shower",
              image: {
                url: "https://d32dm0rphc51dk.cloudfront.net/5RvuM9YF68AyD8OgcdLw7g/small.jpg",
              },
            },
            lot_label: "538",
            sale: {
              end_at: "2018-05-10T20:22:42+00:00",
              live_start_at: "2018-05-09T20:22:42+00:00",
              slug: "best-art-sale-in-town",
            },
          },
        },
        title: "",
      })
    })
  })

  describe("bid failure", () => {
    it("shows the error screen with a failure", () => {
      const component = renderer.create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialProps} />
        </BiddingThemeProvider>
      )
      component.root.findByType(Checkbox).props.onPress()
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted(mockRequestResponses.placingBid.bidRejected, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      jest.runAllTicks()

      expect(nextStep.component).toEqual(BidResultScreen)
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          bidderPositionResult: mockRequestResponses.placingBid.bidRejected.createBidderPosition.result,
        })
      )
    })
  })
})

describe("ConfirmBid for unqualified user", () => {
  const fillOutFormAndSubmit = component => {
    // manually setting state to avoid duplicating tests for skipping UI interaction, but practically better not to do this.
    component.root.findByType(ConfirmBid).instance.setState({ billingAddress })
    component.root.findByType(ConfirmBid).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).props.onPress()
    findPlaceBidButton(component).props.onPress()

    jest.runAllTicks()
  }

  it("shows the billing address that the user typed in the billing address form", () => {
    const billingAddressRow = renderer
      .create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialPropsForUnqualifiedUser} />
        </BiddingThemeProvider>
      )
      .root.findAllByType(TouchableWithoutFeedback)[2]

    billingAddressRow.instance.props.onPress()

    expect(nextStep.component).toEqual(BillingAddress)

    nextStep.passProps.onSubmit(billingAddress)

    expect(billingAddressRow.findAllByType(Serif)[1].props.children).toEqual("401 Broadway 25th floor New York NY")
  })

  it("shows the credit card form when the user tap the edit text in the credit card row", () => {
    const creditcardRow = renderer
      .create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialPropsForUnqualifiedUser} />
        </BiddingThemeProvider>
      )
      .root.findAllByType(TouchableWithoutFeedback)[1]

    creditcardRow.instance.props.onPress()

    expect(nextStep.component).toEqual(CreditCardForm)
  })

  it("shows the error screen when stripe's API returns an error", () => {
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted({}, null)
      return null
    }) as any
    stripe.createTokenWithCard.mockImplementationOnce(() => {
      throw new Error("Error tokenizing card")
    })

    jest.useFakeTimers()
    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialPropsForUnqualifiedUser} />
      </BiddingThemeProvider>
    )

    fillOutFormAndSubmit(component)

    expect(stripe.createTokenWithCard.mock.calls.length).toEqual(1)

    const modal = component.root.findByType(Modal)

    expect(modal.props.detailText).toEqual(
      "There was a problem processing your information. Check your payment details and try again."
    )
    expect(modal.props.visible).toEqual(true)
  })

  it("shows the error screen with the correct error message on a createCreditCard mutation failure", () => {
    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted(mockRequestResponses.creatingCreditCardError, null)
      return null
    }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialPropsForUnqualifiedUser} />
      </BiddingThemeProvider>
    )

    fillOutFormAndSubmit(component)

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
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted({}, errors)
      return null
    }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialPropsForUnqualifiedUser} />
      </BiddingThemeProvider>
    )

    fillOutFormAndSubmit(component)

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

  it("shows the error screen with the default error message if the creditCardMutation error message is empty", () => {
    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted(mockRequestResponses.creatingCreditCardEmptyError, null)
      return null
    }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialPropsForUnqualifiedUser} />
      </BiddingThemeProvider>
    )

    fillOutFormAndSubmit(component)

    expect(component.root.findByType(Modal).findAllByType(Text)[1].props.children).toEqual(
      "There was a problem processing your information. Check your payment details and try again."
    )
    component.root
      .findByType(Modal)
      .findByType(Button)
      .props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("shows the generic error screen on a createCreditCard mutation network failure", () => {
    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
    relay.commitMutation = commitMutationMock((_, { onError }) => {
      onError(new TypeError("Network request failed"))
      return null
    }) as any

    const component = renderer.create(
      <BiddingThemeProvider>
        <ConfirmBid {...initialPropsForUnqualifiedUser} />
      </BiddingThemeProvider>
    )

    fillOutFormAndSubmit(component)

    expect(nextStep.component).toEqual(BidResultScreen)
    expect(nextStep.passProps).toEqual(
      expect.objectContaining({
        bidderPositionResult: {
          message_header: "An error occurred",
          message_description_md: "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
        },
      })
    )
  })

  describe("on a successful bid", () => {
    beforeEach(() => {
      stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
      relay.commitMutation = jest
        .fn()
        .mockImplementationOnce((_, { onCompleted }) => onCompleted(mockRequestResponses.updateMyUserProfile))
        .mockImplementationOnce((_, { onCompleted }) => onCompleted(mockRequestResponses.creatingCreditCardSuccess))
        .mockImplementationOnce((_, { onCompleted }) => onCompleted(mockRequestResponses.placingBid.bidAccepted))
    })

    it("commits two mutations, createCreditCard followed by createBidderPosition", () => {
      mockphysics.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestBidder))

      const component = renderer.create(
        <BiddingThemeProvider>
          <ConfirmBid {...initialPropsForUnqualifiedUser} />
        </BiddingThemeProvider>
      )

      fillOutFormAndSubmit(component)

      expect(relay.commitMutation).toHaveBeenCalled()
      expect(relay.commitMutation).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          variables: {
            input: {
              phone: "111 222 4444",
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
              sale_id: saleArtwork.sale.slug,
              artwork_id: saleArtwork.artwork.slug,
              max_bid_amount_cents: 450000,
            },
          },
        })
      )
    })
  })
})

const serifChildren = comp =>
  comp.root
    .findAllByType(Serif)
    .map(c => (c.props.children.join ? c.props.children.join("") : c.props.children))
    .join(" ")

const saleArtwork: ConfirmBid_sale_artwork = {
  internalID: "internal-id",
  artwork: {
    slug: "meteor-shower",
    title: "Meteor Shower",
    date: "2015",
    artist_names: "Makiko Kudo",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/5RvuM9YF68AyD8OgcdLw7g/small.jpg",
    },
  },
  sale: {
    slug: "best-art-sale-in-town",
    live_start_at: "2018-05-09T20:22:42+00:00",
    end_at: "2018-05-10T20:22:42+00:00",
  },
  lot_label: "538",
  " $fragmentRefs": null, // needs this to keep TS happy
  " $refType": null, // needs this to keep TS happy
}

const mockRequestResponses = {
  updateMyUserProfile: {
    updateMyUserProfile: {
      user: {
        phone: "111 222 4444",
      },
    },
  } as ConfirmBidUpdateUserMutationResponse,
  creatingCreditCardSuccess: {
    createCreditCard: {
      creditCardOrError: {
        creditCard: {
          internalID: "new-credit-card",
          brand: "VISA",
          name: "TEST",
          last_digits: "4242",
          expiration_month: 1,
          expiration_year: 2020,
        },
      },
    },
  } as ConfirmBidCreateCreditCardMutationResponse,
  creatingCreditCardEmptyError: {
    createCreditCard: {
      creditCardOrError: {
        mutationError: {
          detail: "",
          message: "Payment information could not be processed.",
          type: "payment_error",
        },
      },
    },
  } as ConfirmBidCreateCreditCardMutationResponse,
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
  } as ConfirmBidCreateCreditCardMutationResponse,
  placingBid: {
    bidAccepted: {
      createBidderPosition: {
        result: {
          status: "SUCCESS",
          message_header: "Success",
          message_description_md: "",
          position: {
            internalID: "some-bidder-position-id",
          },
        },
      },
    } as ConfirmBidCreateBidderPositionMutationResponse,
    bidRejected: {
      createBidderPosition: {
        result: {
          status: "ERROR",
          message_header: "An error occurred",
          message_description_md: "Some markdown description",
        },
      },
    } as ConfirmBidCreateBidderPositionMutationResponse,
  },
  // TODO: Add types for each mock response
  pollingForBid: {
    highestBidder: {
      data: {
        me: {
          bidder_position: {
            status: "WINNING",
            position: {},
          },
        },
      },
    },
    outbid: {
      data: {
        me: {
          bidder_position: {
            status: "OUTBID",
            position: {},
          },
        },
      },
    },
    pending: {
      data: {
        me: {
          bidder_position: {
            position: {},
            status: "PENDING",
          },
        },
      },
    },
    reserveNotMet: {
      data: {
        me: {
          bidder_position: {
            position: {},
            status: "RESERVE_NOT_MET",
          },
        },
      },
    },
  },
}

const billingAddress: Address = {
  fullName: "Yuki Stockmeier",
  addressLine1: "401 Broadway",
  addressLine2: "25th floor",
  city: "New York",
  state: "NY",
  postalCode: "10013",
  phoneNumber: "111 222 4444",
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

const initialProps: ConfirmBidProps = {
  sale_artwork: saleArtwork,
  increments: [
    {
      cents: 450000,
      display: "$45,000",
    },
    {
      cents: 460000,
      display: "$46,000",
    },
  ],
  selectedBidIndex: 0,
  relay: {
    environment: null,
  },
  me: {
    has_qualified_credit_cards: true,
    bidders: null,
  },
  navigator: mockNavigator,
} as any

const initialPropsForUnqualifiedUser = {
  ...initialProps,
  me: {
    has_qualified_credit_cards: false,
  },
} as any

const initialPropsForRegisteredUser = {
  ...initialProps,
  me: {
    bidders: [{ qualified_for_bidding: true }],
  },
} as any
