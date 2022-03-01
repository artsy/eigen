import { BidderPositionQueryResponse } from "__generated__/BidderPositionQuery.graphql"
import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"
import { ConfirmBidCreateBidderPositionMutationResponse } from "__generated__/ConfirmBidCreateBidderPositionMutation.graphql"
import { ConfirmBidCreateCreditCardMutationResponse } from "__generated__/ConfirmBidCreateCreditCardMutation.graphql"
import { ConfirmBidUpdateUserMutationResponse } from "__generated__/ConfirmBidUpdateUserMutation.graphql"
import { FakeNavigator } from "app/Components/Bidding/Helpers/FakeNavigator"
import { bidderPositionQuery } from "app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
import { Modal } from "app/Components/Modal"
import Spinner from "app/Components/Spinner"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { waitUntil } from "app/tests/waitUntil"
import { merge } from "lodash"
import { Button, LinkText, Sans, Serif, Text } from "palette"
import { Checkbox } from "palette/elements/Checkbox"
import React from "react"
import "react-native"
import { TouchableWithoutFeedback } from "react-native"
import relay from "react-relay"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import stripe from "tipsi-stripe"
import { BidInfoRow } from "../Components/BidInfoRow"
import { Address } from "../types"
import { BidResultScreen } from "./BidResult"
import { BillingAddress } from "./BillingAddress"
import { ConfirmBid, ConfirmBidProps } from "./ConfirmBid"
import { CreditCardForm } from "./CreditCardForm"
import { SelectMaxBid } from "./SelectMaxBid"

jest.mock("app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery", () => ({
  bidderPositionQuery: jest.fn(),
}))
const bidderPositionQueryMock = bidderPositionQuery as jest.Mock<any>

// This lets us import the actual react-relay module, and replace specific functions within it with mocks.
jest.unmock("react-relay")

const commitMutationMock = (fn?: typeof relay.commitMutation) =>
  jest.fn<typeof relay.commitMutation, Parameters<typeof relay.commitMutation>>(fn as any)

jest.mock("tipsi-stripe", () => ({
  setOptions: jest.fn(),
  paymentRequestWithCardForm: jest.fn(),
  createTokenWithCard: jest.fn(),
}))

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
let nextStep
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const mockNavigator = { push: (route) => (nextStep = route) }
jest.useFakeTimers()
const mockPostNotificationName = LegacyNativeModules.ARNotificationsManager
  .postNotificationName as jest.Mock

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const findPlaceBidButton = (component) => {
  return component.root.findAllByType(Button)[1]
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const mountConfirmBidComponent = (props) => {
  return renderWithWrappers(<ConfirmBid {...props} />)
}

beforeEach(() => {
  nextStep = null // reset nextStep between tests
  // Because of how we mock metaphysics, the mocked value from one test can bleed into another.
  bidderPositionQueryMock.mockReset()
  __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsPriceTransparency: true })
})

it("renders without throwing an error", () => {
  mountConfirmBidComponent(initialProps)
})

it("enables the bid button when checkbox is ticked", () => {
  const component = mountConfirmBidComponent(initialProps)

  expect(findPlaceBidButton(component).props.onPress).toBeFalsy()

  component.root.findByType(Checkbox).props.onPress()

  expect(findPlaceBidButton(component).props.onPress).toBeDefined()
})

it("enables the bid button by default if the user is registered", () => {
  const component = mountConfirmBidComponent(initialPropsForRegisteredUser)

  expect(findPlaceBidButton(component).props.onPress).toBeDefined()
})

it("displays the artwork title correctly with date", () => {
  const component = mountConfirmBidComponent(initialProps)

  expect(serifChildren(component)).toContain(", 2015")
})

it("displays the artwork title correctly without date", () => {
  const datelessProps = merge({}, initialProps, { sale_artwork: { artwork: { date: null } } })
  const component = renderWithWrappers(<ConfirmBid {...datelessProps} />)

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  expect(serifChildren(component)).not.toContain(`${saleArtwork.artwork.title},`)
})

it("can load and display price summary", () => {
  const component = mountConfirmBidComponent(initialProps)

  expect(component.root.findAllByType(Spinner).length).toEqual(1)
  ;(defaultEnvironment as any).mock.resolveMostRecentOperation(() => ({
    data: {
      node: {
        __typename: "SaleArtwork",
        calculatedCost: {
          buyersPremium: {
            display: "$9,000.00",
          },
          subtotal: {
            display: "$54,000.00",
          },
        },
      },
    },
  }))

  expect(component.root.findAllByType(Spinner).length).toEqual(0)

  const sansText = component.root
    .findAllByType(Sans)
    .map((sansComponent) => sansComponent.props.children as string)
    .join(" ")

  expect(sansText).toContain("Your max bid $45,000.00")
  expect(sansText).toContain("Buyer’s premium $9,000.00")
  expect(sansText).toContain("Subtotal $54,000.00")
})

it("does not display price summary when the feature flag is off", () => {
  __globalStoreTestUtils__?.injectFeatureFlags({
    AROptionsPriceTransparency: false,
  })

  const component = mountConfirmBidComponent(initialProps)

  expect(component.root.findAllByType(Spinner).length).toEqual(0)

  const sansText = component.root
    .findAllByType(Sans)
    .map((sansComponent) => sansComponent.props.children as string)
    .join(" ")

  expect(sansText).not.toContain("Your max bid $45,000.00")
  expect(sansText).not.toContain("Buyer’s premium $9,000.00")
  expect(sansText).not.toContain("Subtotal $54,000.00")
})

describe("checkbox and payment info display", () => {
  it("shows no checkbox or payment info if the user is registered", () => {
    const component = mountConfirmBidComponent(initialPropsForRegisteredUser)

    expect(component.root.findAllByType(Checkbox).length).toEqual(0)
    expect(component.root.findAllByType(BidInfoRow).length).toEqual(1)

    const serifs = component.root.findAllByType(Serif)
    expect(
      serifs.find(
        (s) => s.props.children.join && s.props.children.join("").includes("You agree to")
      )
    ).toBeTruthy()
  })

  it("shows a checkbox but no payment info if the user is not registered and has cc on file", () => {
    const component = mountConfirmBidComponent(initialProps)

    expect(component.root.findAllByType(Checkbox).length).toEqual(1)
    expect(component.root.findAllByType(BidInfoRow).length).toEqual(1)
  })

  it("shows a checkbox and payment info if the user is not registered and has no cc on file", () => {
    const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

    expect(component.root.findAllByType(Checkbox).length).toEqual(1)
    expect(component.root.findAllByType(BidInfoRow).length).toEqual(3)
  })
})

describe("when pressing bid button", () => {
  it("commits mutation", () => {
    const component = mountConfirmBidComponent(initialProps)

    component.root.findByType(Checkbox).props.onPress()

    relay.commitMutation = jest.fn()

    findPlaceBidButton(component).props.onPress()
    expect(relay.commitMutation).toHaveBeenCalled()
  })

  it("shows a spinner", () => {
    const component = mountConfirmBidComponent(initialProps)

    component.root.findByType(Checkbox).props.onPress()
    relay.commitMutation = jest.fn()
    const placeBidButton = findPlaceBidButton(component)

    placeBidButton.props.onPress()

    expect(placeBidButton.props.loading).toEqual(true)
  })

  it("disables tap events while a spinner is being shown", () => {
    const navigator = { push: jest.fn() } as any
    relay.commitMutation = jest.fn()

    const component = mountConfirmBidComponent({ ...initialPropsForUnqualifiedUser, navigator })

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
    expect(conditionsOfSaleLink.props.onPress).toBeUndefined()
    expect(conditionsOfSaleCheckbox.props.disabled).toBeTruthy()
  })

  describe("when pressing bid", () => {
    it("commits the mutation", () => {
      const component = mountConfirmBidComponent(initialProps)

      component.root.findByType(Checkbox).props.onPress()
      bidderPositionQueryMock.mockReturnValueOnce(
        Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
      )
      relay.commitMutation = jest.fn()

      findPlaceBidButton(component).props.onPress()

      expect(relay.commitMutation).toHaveBeenCalled()
    })

    describe("when mutation fails", () => {
      it("does not verify bid position", () => {
        // Probably due to a network problem.
        const component = mountConfirmBidComponent(initialProps)

        component.root.findByType(Checkbox).props.onPress()
        console.error = jest.fn() // Silences component logging.
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        relay.commitMutation = commitMutationMock((_, { onError }) => {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          onError(new Error("An error occurred."))
          return null
        }) as any

        findPlaceBidButton(component).props.onPress()

        expect(relay.commitMutation).toHaveBeenCalled()
        expect(bidderPositionQueryMock).not.toHaveBeenCalled()
      })

      it("displays an error message on a network failure", () => {
        const component = mountConfirmBidComponent(initialProps)

        component.root.findByType(Checkbox).props.onPress()
        console.error = jest.fn() // Silences component logging.

        // A TypeError is raised when the device has no internet connection.
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        relay.commitMutation = commitMutationMock((_, { onError }) => {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          onError(new TypeError("Network request failed"))
          return null
        }) as any

        findPlaceBidButton(component).props.onPress()

        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        expect(nextStep.component).toEqual(BidResultScreen)
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

      it("displays an error message on a createBidderPosition mutation failure", async () => {
        const error = {
          message:
            'GraphQL Timeout Error: Mutation.createBidderPosition has timed out after waiting for 5000ms"}',
        }

        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          onCompleted({}, [error])
          return null
        }) as any

        const component = mountConfirmBidComponent(initialProps)

        component.root.findByType(Checkbox).props.onPress()
        findPlaceBidButton(component).props.onPress()

        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        await waitUntil(() => nextStep)

        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        expect(nextStep.component).toEqual(BidResultScreen)
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
    fakeNavigator.push({
      component: SelectMaxBid,
      id: "",
      title: "",
      passProps: fakeNavigatorProps,
    })
    fakeNavigator.push({ component: ConfirmBid, id: "", title: "", passProps: fakeNavigatorProps })

    const component = mountConfirmBidComponent({
      ...initialPropsForRegisteredUser,
      navigator: fakeNavigator,
    })

    const selectMaxBidRow = component.root.findAllByType(TouchableWithoutFeedback)[0]

    expect(selectMaxBidRow.findAllByType(Text)[1].props.children).toEqual("$45,000")

    selectMaxBidRow.instance.props.onPress()

    const editScreen = fakeNavigator.nextStep().root.findByType(SelectMaxBid)

    expect(editScreen.props.selectedBidIndex).toEqual(0)

    editScreen.instance.setState({ selectedBidIndex: 1 })
    editScreen.findByType(Button).props.onPress()

    const { selectedBidIndex } = fakeNavigator.nextRoute().passProps as any
    expect(selectedBidIndex).toEqual(1)
  })
})

describe("polling to verify bid position", () => {
  describe("bid success", () => {
    it("polls for new results", async () => {
      const component = mountConfirmBidComponent(initialProps)

      component.root.findByType(Checkbox).props.onPress()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any
      let requestCounter = 0 // On the fifth attempt, return highestBidder
      bidderPositionQueryMock.mockImplementation(() => {
        requestCounter++
        if (requestCounter > 5) {
          return Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
        } else {
          return Promise.resolve(mockRequestResponses.pollingForBid.pending)
        }
      })

      findPlaceBidButton(component).props.onPress()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      await waitUntil(() => nextStep)

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.component).toEqual(BidResultScreen)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          bidderPositionResult: mockRequestResponses.pollingForBid.highestBidder.me.bidder_position,
        })
      )
    })

    it("shows error when polling attempts exceed max", async () => {
      const component = mountConfirmBidComponent(initialProps)

      component.root.findByType(Checkbox).props.onPress()
      bidderPositionQueryMock.mockReturnValue(
        Promise.resolve(mockRequestResponses.pollingForBid.pending)
      )
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      await waitUntil(() => nextStep)

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.component).toEqual(BidResultScreen)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          bidderPositionResult: mockRequestResponses.pollingForBid.pending.me.bidder_position,
        })
      )
    })

    it("shows successful bid result when highest bidder", async () => {
      const component = mountConfirmBidComponent(initialProps)

      component.root.findByType(Checkbox).props.onPress()
      bidderPositionQueryMock.mockReturnValueOnce(
        Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
      )
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      await waitUntil(() => nextStep)

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.component).toEqual(BidResultScreen)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          bidderPositionResult: mockRequestResponses.pollingForBid.highestBidder.me.bidder_position,
        })
      )
    })

    it("shows outbid bidSuccessResult when outbid", async () => {
      const component = mountConfirmBidComponent(initialProps)

      component.root.findByType(Checkbox).props.onPress()
      bidderPositionQueryMock.mockReturnValueOnce(
        Promise.resolve(mockRequestResponses.pollingForBid.outbid)
      )
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      await waitUntil(() => nextStep)

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.component).toEqual(BidResultScreen)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          bidderPositionResult: mockRequestResponses.pollingForBid.outbid.me.bidder_position,
        })
      )
    })

    it("shows reserve not met when reserve is not met", async () => {
      const component = mountConfirmBidComponent(initialProps)

      component.root.findByType(Checkbox).props.onPress()
      bidderPositionQueryMock.mockReturnValueOnce(
        Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet)
      )
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      await waitUntil(() => nextStep)

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.component).toEqual(BidResultScreen)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          bidderPositionResult: mockRequestResponses.pollingForBid.reserveNotMet.me.bidder_position,
        })
      )
    })

    it("updates the main auction screen", async () => {
      const mockedMockNavigator = { push: jest.fn() }
      const component = mountConfirmBidComponent({
        ...initialProps,
        navigator: mockedMockNavigator as any,
        refreshSaleArtwork: jest.fn(),
      })
      component.root.findByType(Checkbox).props.onPress()
      bidderPositionQueryMock.mockReturnValueOnce(
        Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet)
      )
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      await waitUntil(() => mockPostNotificationName.mock.calls.length > 0)

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
            position: {
              internalID: "bidder-position-id-from-polling",
            },
            status: "RESERVE_NOT_MET",
          },
          refreshBidderInfo: expect.anything(),
          refreshSaleArtwork: expect.anything(),
          sale_artwork: {
            id: "node-id",
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
              isBenefit: false,
              live_start_at: "2018-05-09T20:22:42+00:00",
              partner: {
                name: "Christie's",
              },
              slug: "best-art-sale-in-town",
            },
          },
        },
        title: "",
      })
    })
  })

  describe("bid failure", () => {
    it("shows the error screen with a failure", async () => {
      const component = mountConfirmBidComponent(initialProps)

      component.root.findByType(Checkbox).props.onPress()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        onCompleted(mockRequestResponses.placingBid.bidRejected, null)
        return null
      }) as any

      findPlaceBidButton(component).props.onPress()
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      await waitUntil(() => nextStep)

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.component).toEqual(BidResultScreen)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.passProps).toEqual(
        expect.objectContaining({
          bidderPositionResult:
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            mockRequestResponses.placingBid.bidRejected.createBidderPosition.result,
        })
      )
    })
  })
})

describe("ConfirmBid for unqualified user", () => {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const fillOutFormAndSubmit = (component) => {
    // manually setting state to avoid duplicating tests for skipping UI interaction, but practically better not to do this.
    component.root.findByType(ConfirmBid).instance.setState({ billingAddress })
    component.root.findByType(ConfirmBid).instance.setState({ creditCardToken: stripeToken })
    component.root.findByType(Checkbox).props.onPress()
    findPlaceBidButton(component).props.onPress()

    jest.runAllTicks()
  }

  it("shows the billing address that the user typed in the billing address form", () => {
    const billingAddressRow = mountConfirmBidComponent(
      initialPropsForUnqualifiedUser
    ).root.findAllByType(TouchableWithoutFeedback)[2]

    billingAddressRow.instance.props.onPress()

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    expect(nextStep.component).toEqual(BillingAddress)

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    nextStep.passProps.onSubmit(billingAddress)

    expect(billingAddressRow.findAllByType(Text)[1].props.children).toEqual(
      "401 Broadway 25th floor New York NY"
    )
  })

  it("shows the credit card form when the user tap the edit text in the credit card row", () => {
    const creditcardRow = mountConfirmBidComponent(
      initialPropsForUnqualifiedUser
    ).root.findAllByType(TouchableWithoutFeedback)[1]

    creditcardRow.instance.props.onPress()

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    expect(nextStep.component).toEqual(CreditCardForm)
  })

  it("shows the error screen when stripe's API returns an error", () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted({}, null)
      return null
    }) as any
    stripe.createTokenWithCard.mockImplementationOnce(() => {
      throw new Error("Error tokenizing card")
    })

    jest.useFakeTimers()
    const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)
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
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted(mockRequestResponses.creatingCreditCardError, null)
      return null
    }) as any

    const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

    fillOutFormAndSubmit(component)

    expect(component.root.findByType(Modal).findAllByType(Sans)[1].props.children).toEqual(
      "Your card's security code is incorrect."
    )
    component.root.findByType(Modal).findByType(Button).props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("shows the error screen with the default error message if there are unhandled errors from the createCreditCard mutation", () => {
    const errors = [{ message: "malformed error" }]

    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted({}, errors)
      return null
    }) as any

    const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

    fillOutFormAndSubmit(component)

    expect(component.root.findByType(Modal).findAllByType(Sans)[1].props.children).toEqual(
      "There was a problem processing your information. Check your payment details and try again."
    )
    component.root.findByType(Modal).findByType(Button).props.onPress()

    // it dismisses the modal
    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("shows the error screen with the default error message if the creditCardMutation error message is empty", () => {
    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onCompleted(mockRequestResponses.creatingCreditCardEmptyError, null)
      return null
    }) as any

    const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

    fillOutFormAndSubmit(component)

    expect(component.root.findByType(Modal).findAllByType(Sans)[1].props.children).toEqual(
      "There was a problem processing your information. Check your payment details and try again."
    )
    component.root.findByType(Modal).findByType(Button).props.onPress()

    expect(component.root.findByType(Modal).props.visible).toEqual(false)
  })

  it("shows the generic error screen on a createCreditCard mutation network failure", () => {
    console.error = jest.fn() // Silences component logging.
    stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    relay.commitMutation = commitMutationMock((_, { onError }) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      onError(new TypeError("Network request failed"))
      return null
    }) as any

    const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

    fillOutFormAndSubmit(component)

    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    expect(nextStep.component).toEqual(BidResultScreen)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

  describe("After successful mutations", () => {
    beforeEach(() => {
      stripe.createTokenWithCard.mockReturnValueOnce(stripeToken)
      relay.commitMutation = jest
        .fn()
        .mockImplementationOnce((_, { onCompleted }) =>
          onCompleted(mockRequestResponses.updateMyUserProfile)
        )
        .mockImplementationOnce((_, { onCompleted }) =>
          onCompleted(mockRequestResponses.creatingCreditCardSuccess)
        )
        .mockImplementationOnce((_, { onCompleted }) =>
          onCompleted(mockRequestResponses.placingBid.bidAccepted)
        )
    })

    it("commits two mutations, createCreditCard followed by createBidderPosition on a successful bid", async () => {
      bidderPositionQueryMock
        .mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.pending))
        .mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestBidder))

      const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

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
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
              saleID: saleArtwork.sale.slug,
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
              artworkID: saleArtwork.artwork.slug,
              maxBidAmountCents: 450000,
            },
          },
        })
      )

      await waitUntil(() => {
        if (bidderPositionQueryMock.mock.calls.length !== 2) {
          jest.runOnlyPendingTimers()
          return false
        }
        return true
      })

      expect(bidderPositionQueryMock.mock.calls[0][0]).toEqual("bidder-position-id-from-mutation")
      expect(bidderPositionQueryMock.mock.calls[1][0]).toEqual("bidder-position-id-from-polling")
    })

    it("displays an error message on polling failure", async () => {
      console.error = jest.fn() // Silences component logging.
      bidderPositionQueryMock.mockReturnValueOnce(Promise.reject({ message: "error" }))

      const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

      fillOutFormAndSubmit(component)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      await waitUntil(() => nextStep)

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      expect(nextStep.component).toEqual(BidResultScreen)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const serifChildren = (comp) =>
  comp.root
    .findAllByType(Serif)
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    .map((c) => (c.props.children.join ? c.props.children.join("") : c.props.children))
    .join(" ")

const saleArtwork: ConfirmBid_sale_artwork = {
  id: "node-id",
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
    isBenefit: false,
    partner: {
      name: "Christie's",
    },
  },
  lot_label: "538",
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  " $fragmentRefs": null, // needs this to keep TS happy
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
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
            internalID: "bidder-position-id-from-mutation",
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
  pollingForBid: {
    highestBidder: {
      me: {
        bidder_position: {
          status: "WINNING",
          position: {
            internalID: "bidder-position-id-from-polling",
          },
        },
      },
    } as BidderPositionQueryResponse,
    outbid: {
      me: {
        bidder_position: {
          status: "OUTBID",
          position: {
            internalID: "bidder-position-id-from-polling",
          },
        },
      },
    } as BidderPositionQueryResponse,
    pending: {
      me: {
        bidder_position: {
          position: {
            internalID: "bidder-position-id-from-polling",
          },
          status: "PENDING",
        },
      },
    } as BidderPositionQueryResponse,
    reserveNotMet: {
      me: {
        bidder_position: {
          position: {
            internalID: "bidder-position-id-from-polling",
          },
          status: "RESERVE_NOT_MET",
        },
      },
    } as BidderPositionQueryResponse,
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
