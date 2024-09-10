import { Text, LinkText, Checkbox, Button } from "@artsy/palette-mobile"
import { createToken } from "@stripe/stripe-react-native"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { BidderPositionQuery$data } from "__generated__/BidderPositionQuery.graphql"
import { ConfirmBidCreateBidderPositionMutation } from "__generated__/ConfirmBidCreateBidderPositionMutation.graphql"
import { ConfirmBidCreateCreditCardMutation } from "__generated__/ConfirmBidCreateCreditCardMutation.graphql"
import { ConfirmBidUpdateUserMutation } from "__generated__/ConfirmBidUpdateUserMutation.graphql"
import { ConfirmBid_sale_artwork$data } from "__generated__/ConfirmBid_sale_artwork.graphql"
import { BidInfoRow } from "app/Components/Bidding/Components/BidInfoRow"
import { FakeNavigator } from "app/Components/Bidding/Helpers/FakeNavigator"
import { bidderPositionQuery } from "app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
import { Address } from "app/Components/Bidding/types"
import { Modal } from "app/Components/Modal"
import Spinner from "app/Components/Spinner"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import * as navigation from "app/system/navigation/navigate"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import NavigatorIOS, {
  NavigatorIOSPushArgs,
} from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { merge } from "lodash"
import { TouchableWithoutFeedback } from "react-native"
import relay from "react-relay"
import { ReactTestRenderer } from "react-test-renderer"
import { BidResultScreen } from "./BidResult"
import { BillingAddress } from "./BillingAddress"
import { ConfirmBid, ConfirmBidProps } from "./ConfirmBid"
import { CreditCardForm } from "./CreditCardForm"
import { SelectMaxBid } from "./SelectMaxBid"

jest.mock("app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery", () => ({
  bidderPositionQuery: jest.fn(),
}))

jest.mock("@stripe/stripe-react-native", () => ({
  createToken: jest.fn(),
}))

describe("ConfirmBid", () => {
  Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds

  const bidderPositionQueryMock = bidderPositionQuery as jest.Mock<any>

  const commitMutationMock = (fn?: typeof relay.commitMutation) =>
    jest.fn<typeof relay.commitMutation, Parameters<typeof relay.commitMutation>>(fn as any)

  let nextStep: NavigatorIOSPushArgs | null
  const mockNavigator: Partial<NavigatorIOS> = { push: (route) => (nextStep = route) }

  const mockPostNotificationName = LegacyNativeModules.ARNotificationsManager
    .postNotificationName as jest.Mock

  const findPlaceBidButton = (component: ReactTestRenderer) => {
    return component.root.findByProps({ testID: "bid-button" })
  }

  const mountConfirmBidComponent = (props: ConfirmBidProps) => {
    return renderWithWrappersLEGACY(<ConfirmBid {...props} />)
  }

  beforeEach(() => {
    nextStep = null // reset nextStep between tests
    // Because of how we mock metaphysics, the mocked value from one test can bleed into another.
    bidderPositionQueryMock.mockReset()
  })

  describe("disclaimer", () => {
    describe("when the user is not registered", () => {
      it("displays a checkbox", () => {
        renderWithWrappers(<ConfirmBid {...initialProps} />)

        expect(screen.getByTestId("disclaimer-checkbox")).toBeDefined()
      })

      it("displays a disclaimer", () => {
        renderWithWrappers(<ConfirmBid {...initialProps} />)

        expect(screen.getByTestId("disclaimer")).toHaveTextContent(
          "I agree to Artsy's and Christie's Conditions of Sale. I understand that all bids are binding and may not be retracted."
        )
      })

      it("navigates to the conditions of sale when the user taps the link", () => {
        jest.mock("app/system/navigation/navigate", () => ({
          ...jest.requireActual("app/system/navigation/navigate"),
          navigate: jest.fn(),
        }))

        renderWithWrappers(<ConfirmBid {...initialProps} />)

        fireEvent.press(screen.getByText("Artsy's and Christie's Conditions of Sale"))

        expect(navigation.navigate).toHaveBeenCalledWith("/conditions-of-sale")
      })

      describe("when AREnableNewTermsAndConditions is enabled", () => {
        beforeEach(() => {
          __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewTermsAndConditions: true })
        })

        it("displays a disclaimer", () => {
          renderWithWrappers(<ConfirmBid {...initialProps} />)

          expect(screen.getByTestId("disclaimer")).toHaveTextContent(
            "I agree to Artsy's and Christie's General Terms and Conditions of Sale. I understand that all bids are binding and may not be retracted."
          )
        })

        it("navigates to the terms screen when the user taps the link", () => {
          jest.mock("app/system/navigation/navigate", () => ({
            ...jest.requireActual("app/system/navigation/navigate"),
            navigate: jest.fn(),
          }))

          renderWithWrappers(<ConfirmBid {...initialProps} />)

          fireEvent.press(
            screen.getByText("Artsy's and Christie's General Terms and Conditions of Sale")
          )

          expect(navigation.navigate).toHaveBeenCalledWith("/terms")
        })
      })
    })

    describe("when the user is registered", () => {
      it("does not display a checkbox", () => {
        renderWithWrappers(<ConfirmBid {...initialPropsForRegisteredUser} />)

        expect(screen.queryByTestId("disclaimer-checkbox")).toBeNull()
      })

      it("displays a disclaimer", () => {
        renderWithWrappers(<ConfirmBid {...initialPropsForRegisteredUser} />)

        expect(screen.getByTestId("disclaimer")).toHaveTextContent(
          "I agree to Artsy's and Christie's Conditions of Sale. I understand that all bids are binding and may not be retracted."
        )
      })

      it("navigates to the conditions of sale when the user taps the link", () => {
        jest.mock("app/system/navigation/navigate", () => ({
          ...jest.requireActual("app/system/navigation/navigate"),
          navigate: jest.fn(),
        }))

        renderWithWrappers(<ConfirmBid {...initialPropsForRegisteredUser} />)

        fireEvent.press(screen.getByText("Artsy's and Christie's Conditions of Sale"))

        expect(navigation.navigate).toHaveBeenCalledWith("/conditions-of-sale")
      })

      describe("when AREnableNewTermsAndConditions is enabled", () => {
        beforeEach(() => {
          __globalStoreTestUtils__?.injectFeatureFlags({ AREnableNewTermsAndConditions: true })
        })

        it("displays a disclaimer", () => {
          renderWithWrappers(<ConfirmBid {...initialPropsForRegisteredUser} />)

          expect(screen.getByTestId("disclaimer")).toHaveTextContent(
            "I agree to Artsy's and Christie's General Terms and Conditions of Sale. I understand that all bids are binding and may not be retracted."
          )
        })

        it("navigates to the terms when the user taps the link", () => {
          jest.mock("app/system/navigation/navigate", () => ({
            ...jest.requireActual("app/system/navigation/navigate"),
            navigate: jest.fn(),
          }))

          renderWithWrappers(<ConfirmBid {...initialPropsForRegisteredUser} />)

          fireEvent.press(
            screen.getByText("Artsy's and Christie's General Terms and Conditions of Sale")
          )

          expect(navigation.navigate).toHaveBeenCalledWith("/terms")
        })
      })
    })
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
    const component = renderWithWrappersLEGACY(<ConfirmBid {...datelessProps} />)

    expect(serifChildren(component)).not.toContain(`${saleArtwork.artwork!.title},`)
  })

  it("can load and display price summary", () => {
    const component = mountConfirmBidComponent(initialProps)

    expect(component.root.findAllByType(Spinner).length).toEqual(1)
    getMockRelayEnvironment().mock.resolveMostRecentOperation(() => ({
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

    const TextText = component.root
      .findAllByType(Text)
      .map((TextComponent) => TextComponent.props.children as string)
      .join(" ")

    expect(TextText).toContain("Your max bid $45,000.00")
    expect(TextText).toContain("Buyer’s premium $9,000.00")
    expect(TextText).toContain("Subtotal $54,000.00")
  })

  describe("checkbox and payment info display", () => {
    it("shows no checkbox or payment info if the user is registered", () => {
      const component = mountConfirmBidComponent(initialPropsForRegisteredUser)

      expect(component.root.findAllByType(Checkbox).length).toEqual(0)
      expect(component.root.findAllByType(BidInfoRow).length).toEqual(1)

      const serifs = component.root.findAllByType(Text)
      expect(
        serifs.find(
          (s) => s.props.children.join && s.props.children.join("").includes("I agree to")
        )
      ).toBeTruthy()
    })

    it("shows a checkbox but no payment info if the user is not registered and has cc on file", () => {
      const component = mountConfirmBidComponent(initialProps)

      expect(component.root.findAllByType(Checkbox).length).toEqual(1)
      expect(component.root.findAllByType(BidInfoRow).length).toEqual(1)
    })

    it("shows a checkbox and payment info if the user is not registered and has no cc on file", async () => {
      const { root } = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

      const checkboxs = await root.findAllByType(Checkbox)
      const bidInfoRows = await root.findAllByType(BidInfoRow)

      expect(checkboxs.length).toEqual(1)
      expect(bidInfoRows.length).toEqual(2)
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
          relay.commitMutation = commitMutationMock((_, { onError }) => {
            onError!(new Error("An error occurred."))
            return { dispose: jest.fn() }
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
          relay.commitMutation = commitMutationMock((_, { onError }) => {
            onError!(new TypeError("Network request failed"))
            return { dispose: jest.fn() }
          }) as any

          findPlaceBidButton(component).props.onPress()

          expect(nextStep?.component).toEqual(BidResultScreen)
          expect(nextStep?.passProps).toEqual(
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

          relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
            onCompleted!({}, [error])
            return { dispose: jest.fn() }
          }) as any

          const component = mountConfirmBidComponent(initialProps)

          component.root.findByType(Checkbox).props.onPress()
          findPlaceBidButton(component).props.onPress()

          await waitFor(() => !!nextStep)

          expect(nextStep?.component).toEqual(BidResultScreen)
          expect(nextStep?.passProps).toEqual(
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
      fakeNavigator.push({
        component: ConfirmBid,
        id: "",
        title: "",
        passProps: fakeNavigatorProps,
      })

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
        relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
          onCompleted!(mockRequestResponses.placingBid.bidAccepted, null)
          return { dispose: jest.fn() }
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
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResultScreen)
        expect(nextStep?.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.pollingForBid.highestBidder.me!.bidder_position,
          })
        )
      })

      it("shows error when polling attempts exceed max", async () => {
        const component = mountConfirmBidComponent(initialProps)

        component.root.findByType(Checkbox).props.onPress()
        bidderPositionQueryMock.mockReturnValue(
          Promise.resolve(mockRequestResponses.pollingForBid.pending)
        )
        relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
          onCompleted!(mockRequestResponses.placingBid.bidAccepted, null)
          return { dispose: jest.fn() }
        }) as any

        findPlaceBidButton(component).props.onPress()
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResultScreen)
        expect(nextStep?.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult: mockRequestResponses.pollingForBid.pending.me!.bidder_position,
          })
        )
      })

      it("shows successful bid result when highest bidder", async () => {
        const component = mountConfirmBidComponent(initialProps)

        component.root.findByType(Checkbox).props.onPress()
        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
        )
        relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
          onCompleted!(mockRequestResponses.placingBid.bidAccepted, null)
          return { dispose: jest.fn() }
        }) as any

        findPlaceBidButton(component).props.onPress()
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResultScreen)
        expect(nextStep?.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.pollingForBid.highestBidder.me!.bidder_position,
          })
        )
      })

      it("shows outbid bidSuccessResult when outbid", async () => {
        const component = mountConfirmBidComponent(initialProps)

        component.root.findByType(Checkbox).props.onPress()
        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.outbid)
        )
        relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
          onCompleted!(mockRequestResponses.placingBid.bidAccepted, null)
          return { dispose: jest.fn() }
        }) as any

        findPlaceBidButton(component).props.onPress()
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResultScreen)
        expect(nextStep?.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult: mockRequestResponses.pollingForBid.outbid.me!.bidder_position,
          })
        )
      })

      it("shows reserve not met when reserve is not met", async () => {
        const component = mountConfirmBidComponent(initialProps)

        component.root.findByType(Checkbox).props.onPress()
        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet)
        )
        relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
          onCompleted!(mockRequestResponses.placingBid.bidAccepted, null)
          return { dispose: jest.fn() }
        }) as any

        findPlaceBidButton(component).props.onPress()
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResultScreen)
        expect(nextStep?.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.pollingForBid.reserveNotMet.me!.bidder_position,
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
        relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
          onCompleted!(mockRequestResponses.placingBid.bidAccepted, null)
          return { dispose: jest.fn() }
        }) as any

        findPlaceBidButton(component).props.onPress()
        await waitFor(() => mockPostNotificationName.mock.calls.length > 0)

        expect(mockPostNotificationName).toHaveBeenCalledWith(
          "ARAuctionArtworkRegistrationUpdated",
          {
            ARAuctionID: "best-art-sale-in-town",
          }
        )
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
            biddingEndAt: expect.anything(),
            refreshBidderInfo: expect.anything(),
            refreshSaleArtwork: expect.anything(),
            sale_artwork: {
              endAt: null,
              id: "node-id",
              internalID: "internal-id",
              " $fragmentSpreads": null,
              " $fragmentType": null,
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
              extendedBiddingEndAt: null,
              sale: {
                start_at: "2018-05-08T20:22:42+00:00",
                cascadingEndTimeIntervalMinutes: null,
                end_at: "2018-05-10T20:22:42+00:00",
                internalID: "internal-id",
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
        relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
          onCompleted!(mockRequestResponses.placingBid.bidRejected, null)
          return { dispose: jest.fn() }
        }) as any

        findPlaceBidButton(component).props.onPress()
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResultScreen)
        expect(nextStep?.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.placingBid.bidRejected.createBidderPosition!.result,
          })
        )
      })
    })
  })

  describe("ConfirmBid for unqualified user", () => {
    const fillOutFormAndSubmit = async (component: ReactTestRenderer) => {
      const confirmBidComponent = await component.root.findByType(ConfirmBid)
      // manually setting state to avoid duplicating tests for skipping UI interaction, but practically better not to do this.
      confirmBidComponent.instance.setState({ billingAddress })
      confirmBidComponent.instance.setState({ creditCardToken: stripeToken.token })

      const checkbox = await component.root.findByType(Checkbox)
      checkbox.props.onPress()

      const bidButton = await findPlaceBidButton(component)
      bidButton.props.onPress()
    }

    // skipping since we don't have billing address now
    xit("shows the billing address that the user typed in the billing address form", () => {
      const billingAddressRow = mountConfirmBidComponent(
        initialPropsForUnqualifiedUser
      ).root.findAllByType(TouchableWithoutFeedback)[2]

      billingAddressRow.instance.props.onPress()

      const passProps = nextStep?.passProps as {
        onSubmit: (address: Address) => void
      }

      expect(nextStep?.component).toEqual(BillingAddress)
      passProps.onSubmit(billingAddress)

      expect(billingAddressRow.findAllByType(Text)[1].props.children).toEqual(
        "401 Broadway 25th floor New York NY"
      )
    })

    it("shows the credit card form when the user tap the edit text in the credit card row", () => {
      const creditcardRow = mountConfirmBidComponent(
        initialPropsForUnqualifiedUser
      ).root.findAllByType(TouchableWithoutFeedback)[1]

      creditcardRow.instance.props.onPress()

      expect(nextStep?.component).toEqual(CreditCardForm)
    })

    it("shows the error screen when stripe's API returns an error", async () => {
      renderWithWrappers(<ConfirmBid {...initialPropsForUnqualifiedUser} />)
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted!({}, null)
        return { dispose: jest.fn() }
      }) as any
      ;(createToken as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Error tokenizing card")
      })

      // UNSAFELY getting the component instance to set state for testing purposes only
      screen.UNSAFE_getByType(ConfirmBid).instance.setState({ billingAddress })
      screen.UNSAFE_getByType(ConfirmBid).instance.setState({ creditCardToken: stripeToken })

      // Check the checkbox and press the Bid button
      fireEvent.press(screen.UNSAFE_getByType(Checkbox))
      fireEvent.press(screen.getByTestId("bid-button"))

      // wait for modal to be displayed
      await screen.findByText(
        "There was a problem processing your information. Check your payment details and try again."
      )
      expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", true)

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", false)
    })

    it("shows the error screen with the correct error message on a createCreditCard mutation failure", async () => {
      renderWithWrappers(<ConfirmBid {...initialPropsForUnqualifiedUser} />)
      ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted!(mockRequestResponses.creatingCreditCardError, null)
        return { dispose: jest.fn() }
      }) as any

      // UNSAFELY getting the component instance to set state for testing purposes only
      screen.UNSAFE_getByType(ConfirmBid).instance.setState({ billingAddress })
      screen.UNSAFE_getByType(ConfirmBid).instance.setState({ creditCardToken: stripeToken })

      // Check the checkbox and press the Bid button
      fireEvent.press(screen.UNSAFE_getByType(Checkbox))
      fireEvent.press(screen.getByTestId("bid-button"))

      await screen.findByText("Your card's security code is incorrect.")
      expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", true)

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", false)
    })

    it("shows the error screen with the default error message if there are unhandled errors from the createCreditCard mutation", async () => {
      const errors = [{ message: "malformed error" }]

      console.error = jest.fn() // Silences component logging.
      ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted!({}, errors)
        return { dispose: jest.fn() }
      }) as any

      const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

      await fillOutFormAndSubmit(component)

      const modal = await component.root.findByType(Modal)
      const modalText = await modal.findAllByType(Text)
      const modalButton = await modal.findByType(Button)

      expect(modalText[1].props.children).toEqual([
        "There was a problem processing your information. Check your payment details and try again.",
      ])
      modalButton.props.onPress()

      // it dismisses the modal
      expect(modal.props.visible).toEqual(false)
    })

    it("shows the error screen with the default error message if the creditCardMutation error message is empty", async () => {
      renderWithWrappers(<ConfirmBid {...initialPropsForUnqualifiedUser} />)
      ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted!(mockRequestResponses.creatingCreditCardEmptyError, null)
        return { dispose: jest.fn() }
      }) as any

      // UNSAFELY getting the component instance to set state for testing purposes only
      screen.UNSAFE_getByType(ConfirmBid).instance.setState({ billingAddress })
      screen.UNSAFE_getByType(ConfirmBid).instance.setState({ creditCardToken: stripeToken })

      // Check the checkbox and press the Bid button
      fireEvent.press(screen.UNSAFE_getByType(Checkbox))
      fireEvent.press(screen.getByTestId("bid-button"))

      await screen.findByText(
        "There was a problem processing your information. Check your payment details and try again."
      )
      expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", true)

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(screen.UNSAFE_getByType(Modal)).toHaveProp("visible", false)
    })

    it("shows the generic error screen on a createCreditCard mutation network failure", async () => {
      console.error = jest.fn() // Silences component logging.
      ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
      relay.commitMutation = commitMutationMock((_, { onError }) => {
        onError!(new TypeError("Network request failed"))
        return { dispose: jest.fn() }
      }) as any

      const component = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

      await fillOutFormAndSubmit(component)

      expect(nextStep?.component).toEqual(BidResultScreen)
      expect(nextStep?.passProps).toEqual(
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
        ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
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

        renderWithWrappers(<ConfirmBid {...initialPropsForUnqualifiedUser} />)

        // UNSAFELY getting the component instance to set state for testing purposes only
        screen.UNSAFE_getByType(ConfirmBid).instance.setState({ billingAddress })
        screen
          .UNSAFE_getByType(ConfirmBid)
          .instance.setState({ creditCardToken: stripeToken.token })

        // Check the checkbox and press the Bid button
        fireEvent.press(screen.UNSAFE_getByType(Checkbox))
        fireEvent.press(screen.getByTestId("bid-button"))

        await waitFor(() => expect(relay.commitMutation).toHaveBeenCalled())
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
                saleID: saleArtwork.sale!.slug,
                artworkID: saleArtwork.artwork!.slug,
                maxBidAmountCents: 450000,
              },
            },
          })
        )

        await waitFor(() => {
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
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResultScreen)
        expect(nextStep?.passProps).toEqual(
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

  describe("cascading end times", () => {
    it("sale endtime defaults to extendedBiddingEndtime", () => {
      renderWithWrappers(<ConfirmBid {...initialPropsForCascadingSale} />)

      expect(screen.queryByText("00d 00h 00m 10s")).toBeOnTheScreen()
    })

    it("shows the sale's end time if the sale does not have cascading end times", () => {
      renderWithWrappers(<ConfirmBid {...initialPropsForNonCascadingSale} />)

      expect(screen.queryByText("00d 00h 00m 10s")).toBeOnTheScreen()
    })
  })

  const serifChildren = (comp: ReactTestRenderer) =>
    comp.root
      .findAllByType(Text)
      .map((c) => (c.props.children.join ? c.props.children.join("") : c.props.children))
      .join(" ")

  const baseSaleArtwork = {
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
      internalID: "internal-id",
      slug: "best-art-sale-in-town",
      start_at: "2018-05-08T20:22:42+00:00",
      end_at: "2018-05-10T20:22:42+00:00",
      isBenefit: false,
      partner: {
        name: "Christie's",
      },
    },
    lot_label: "538",
  }

  const saleArtwork: ConfirmBid_sale_artwork$data = {
    ...baseSaleArtwork,
    endAt: null,
    extendedBiddingEndAt: null,
    sale: {
      ...baseSaleArtwork.sale,
      live_start_at: "2018-05-09T20:22:42+00:00",
      cascadingEndTimeIntervalMinutes: null,
    },
    " $fragmentSpreads": null as any, // needs this to keep TS happy
    " $fragmentType": null as any, // needs this to keep TS happy
  }

  const nonCascadeSaleArtwork: ConfirmBid_sale_artwork$data = {
    ...baseSaleArtwork,
    endAt: null,
    extendedBiddingEndAt: null,
    sale: {
      ...baseSaleArtwork.sale,
      end_at: new Date(Date.now() + 10000).toISOString(),
      live_start_at: null,
      cascadingEndTimeIntervalMinutes: null,
    },
    " $fragmentSpreads": null as any, // needs this to keep TS happy
    " $fragmentType": null as any, // needs this to keep TS happy
  }

  const cascadingEndTimeSaleArtwork: ConfirmBid_sale_artwork$data = {
    ...saleArtwork,
    endAt: "2018-05-13T20:22:42+00:00",
    extendedBiddingEndAt: new Date(Date.now() + 10000).toISOString(),
    sale: {
      ...baseSaleArtwork.sale,
      live_start_at: null,
      cascadingEndTimeIntervalMinutes: 1,
    },
  }

  const mockRequestResponses = {
    updateMyUserProfile: {
      updateMyUserProfile: {
        user: {
          phone: "111 222 4444",
        },
      },
    } as ConfirmBidUpdateUserMutation["response"],
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
    } as ConfirmBidCreateCreditCardMutation["response"],
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
    } as ConfirmBidCreateCreditCardMutation["response"],
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
    } as ConfirmBidCreateCreditCardMutation["response"],
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
      } as ConfirmBidCreateBidderPositionMutation["response"],
      bidRejected: {
        createBidderPosition: {
          result: {
            status: "ERROR",
            message_header: "An error occurred",
            message_description_md: "Some markdown description",
          },
        },
      } as ConfirmBidCreateBidderPositionMutation["response"],
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
      } as BidderPositionQuery$data,
      outbid: {
        me: {
          bidder_position: {
            status: "OUTBID",
            position: {
              internalID: "bidder-position-id-from-polling",
            },
          },
        },
      } as BidderPositionQuery$data,
      pending: {
        me: {
          bidder_position: {
            position: {
              internalID: "bidder-position-id-from-polling",
            },
            status: "PENDING",
          },
        },
      } as BidderPositionQuery$data,
      reserveNotMet: {
        me: {
          bidder_position: {
            position: {
              internalID: "bidder-position-id-from-polling",
            },
            status: "RESERVE_NOT_MET",
          },
        },
      } as BidderPositionQuery$data,
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

  const initialPropsForCascadingSale = {
    ...initialProps,
    sale_artwork: cascadingEndTimeSaleArtwork,
  }

  const initialPropsForNonCascadingSale = {
    ...initialProps,
    sale_artwork: nonCascadeSaleArtwork,
  }
})
