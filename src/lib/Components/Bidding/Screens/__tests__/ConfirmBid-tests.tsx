jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { merge } from "lodash"
import { Button, Sans, Serif } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import "react-native"

import { LinkText } from "../../../Text/LinkText"
import { BidInfoRow } from "../../Components/BidInfoRow"
import { Checkbox } from "../../Components/Checkbox"

import { ConfirmBid, ConfirmBidProps } from "../ConfirmBid"

jest.mock("lib/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery", () => ({
  bidderPositionQuery: jest.fn(),
}))
import { bidderPositionQuery } from "lib/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
const bidderPositionQueryMock = bidderPositionQuery as jest.Mock<any>

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
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import stripe from "tipsi-stripe"

import { BidderPositionQueryResponse } from "__generated__/BidderPositionQuery.graphql"
import { ConfirmBid_sale_artwork } from "__generated__/ConfirmBid_sale_artwork.graphql"
import { ConfirmBidCreateBidderPositionMutationResponse } from "__generated__/ConfirmBidCreateBidderPositionMutation.graphql"
import { ConfirmBidCreateCreditCardMutationResponse } from "__generated__/ConfirmBidCreateCreditCardMutation.graphql"
import { ConfirmBidUpdateUserMutationResponse } from "__generated__/ConfirmBidUpdateUserMutation.graphql"
import Spinner from "lib/Components/Spinner"
import { defaultEnvironment } from "lib/relay/createEnvironment"

import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { ReactTestRenderer } from "react-test-renderer"
import { BiddingThemeProvider } from "../../Components/BiddingThemeProvider"
import { Address } from "../../types"

jest.useFakeTimers()

const mockNavigate = jest.fn()

const findPlaceBidButton = (tree: ReactTestRenderer) => {
  return tree.root.findAllByType(Button)[1]
}

const mountConfirmBidComponent = (props: ConfirmBidProps) => {
  return renderWithWrappers(
    <BiddingThemeProvider>
      <ConfirmBid {...props} />
    </BiddingThemeProvider>
  )
}

describe("ConfirmBid", () => {
  beforeEach(() => {
    // Because of how we mock metaphysics, the mocked value from one test can bleed into another.
    bidderPositionQueryMock.mockReset()
    __globalStoreTestUtils__?.injectEmissionOptions({ AROptionsPriceTransparency: true })
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
    const component = renderWithWrappers(
      <BiddingThemeProvider>
        <ConfirmBid {...datelessProps} />
      </BiddingThemeProvider>
    )

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
    __globalStoreTestUtils__?.injectEmissionOptions({
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
        serifs.find((s) => s.props.children.join && s.props.children.join("").includes("You agree to"))
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
      relay.commitMutation = jest.fn()

      const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

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

      expect(mockNavigate).not.toHaveBeenCalled()

      creditCardRow.instance.props.onPress()

      expect(mockNavigate).not.toHaveBeenCalled()

      billingAddressRow.instance.props.onPress()

      expect(mockNavigate).not.toHaveBeenCalled()
      expect(conditionsOfSaleLink.props.onPress).toBeUndefined()
      expect(conditionsOfSaleCheckbox.props.disabled).toBeTruthy()
    })
  })

  describe("when pressing bid", () => {
    it("commits the mutation", () => {
      const component = mountConfirmBidComponent(initialProps)

      component.root.findByType(Checkbox).props.onPress()
      bidderPositionQueryMock.mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestBidder))
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

      it("navigate to bid result screen on failure", () => {
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

        expect(mockNavigate).toBeCalledWith("BidResultScreen", {
          bidderPositionResult: {
            status: "ERROR",
            message_header: "An error occurred",
            message_description_md:
              "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
          },
        })
      })

      it("displays an error message on a createBidderPosition mutation failure", async () => {
        const error = {
          message: 'GraphQL Timeout Error: Mutation.createBidderPosition has timed out after waiting for 5000ms"}',
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

        expect(mockNavigate).toBeCalledWith("BidResultScreen", {
          bidderPositionResult: {
            status: "ERROR",
            message_header: "An error occurred",
            message_description_md:
              "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
          },
        })
      })
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
  navigation: {
    goBack: jest.fn(),
    navigate: mockNavigate,
  },
  route: {
    params: {
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
      refreshSaleArtwork: jest.fn(),
    },
  },
  sale_artwork: saleArtwork,
  relay: {
    environment: null,
  },
  me: {
    has_qualified_credit_cards: true,
    bidders: null,
  },
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
