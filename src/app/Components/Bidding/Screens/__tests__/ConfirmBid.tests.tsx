import { Button, Checkbox } from "@artsy/palette-mobile"
import Sentry from "@sentry/react-native"
import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react-native"
import { BidderPositionQuery$data } from "__generated__/BidderPositionQuery.graphql"
import { ConfirmBid_saleArtwork$data } from "__generated__/ConfirmBid_saleArtwork.graphql"
import { useCreateBidderPositionMutation } from "__generated__/useCreateBidderPositionMutation.graphql"
import { useCreateCreditCardMutation } from "__generated__/useCreateCreditCardMutation.graphql"
import { useUpdateUserPhoneNumberMutation } from "__generated__/useUpdateUserPhoneNumberMutation.graphql"
import {
  BidFlowContextProvider,
  BidFlowContextStore,
} from "app/Components/Bidding/Context/BidFlowContextProvider"
import { ConfirmBid } from "app/Components/Bidding/Screens/ConfirmBid"
import { bidderPositionQuery } from "app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
import { Address } from "app/Components/Bidding/types"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import * as navigation from "app/system/navigation/navigate"
import { useCreateBidderPosition } from "app/utils/mutations/useCreateBidderPosition"
import { useCreateCreditCard } from "app/utils/mutations/useCreateCreditCard"
import { useUpdateUserPhoneNumber } from "app/utils/mutations/useUpdateUserPhoneNumber"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { merge } from "lodash"
import relay, { graphql } from "react-relay"

jest.mock("app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery", () => ({
  bidderPositionQuery: jest.fn(),
}))

jest.mock("@stripe/stripe-react-native", () => ({
  createToken: jest.fn(),
}))

jest.mock("app/utils/mutations/useCreateBidderPosition", () => ({
  useCreateBidderPosition: jest.fn(),
}))

jest.mock("app/utils/mutations/useCreateCreditCard", () => ({
  useCreateCreditCard: jest.fn(),
}))

jest.mock("app/utils/mutations/useUpdateUserPhoneNumber", () => ({
  useUpdateUserPhoneNumber: jest.fn(),
}))

describe("ConfirmBid", () => {
  Date.now = () => 1525983752000 // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds

  const bidderPositionQueryMock = bidderPositionQuery as jest.Mock<any>

  const commitMutationMock = (fn?: typeof relay.commitMutation) =>
    jest.fn<typeof relay.commitMutation, Parameters<typeof relay.commitMutation>>(fn as any)

  const mockNavigator = { navigate: jest.fn(), goBack: jest.fn() }

  const mockPostNotificationName = LegacyNativeModules.ARNotificationsManager
    .postNotificationName as jest.Mock

  const mockCreateBidderMutation = jest.fn()
  const useCreateBidderPositionMock = useCreateBidderPosition as jest.Mock<any>
  const mockCreateCreditCardMutation = jest.fn()
  const useCreateCreditCardMock = useCreateCreditCard as jest.Mock<any>
  const mockUpdateUserPhoneNumberMutation = jest.fn()
  const useUpdateUserPhoneNumberMock = useUpdateUserPhoneNumber as jest.Mock
  const navigateSpy = jest.spyOn(navigation, "navigate")
  let mockStore: ReturnType<typeof BidFlowContextStore.useStore>

  const MockStoreInstance = () => {
    mockStore = BidFlowContextStore.useStore()
    return null
  }

  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => {
      return (
        <BidFlowContextProvider
          runtimeModel={{
            saleArtworkIncrements: [
              { cents: 450000, display: "$45,000" },
              { cents: 460000, display: "$46,000" },
            ],
            selectedBidIndex: 0,
          }}
        >
          <ConfirmBid
            navigation={mockNavigator as any}
            route={
              { params: { ...props, saleArtwork: props.artwork.saleArtwork, me: props.me } } as any
            }
          />
          <MockStoreInstance />
        </BidFlowContextProvider>
      )
    },
    query: graphql`
      query ConfirmBidTestQuery($artworkID: String!, $saleID: String!) @relay_test_operation {
        artwork(id: $artworkID) {
          saleArtwork(saleID: $saleID) {
            ...ConfirmBid_saleArtwork
          }
        }
        me {
          ...ConfirmBid_me
        }
      }
    `,
    variables: { artworkID: "artwork-id", saleID: "sale-id" },
  })

  beforeEach(() => {
    // Because of how we mock metaphysics, the mocked value from one test can bleed into another.
    bidderPositionQueryMock.mockReset()

    useCreateBidderPositionMock.mockReturnValue([mockCreateBidderMutation, false])
    useCreateCreditCardMock.mockReturnValue([mockCreateCreditCardMutation, false])
    useUpdateUserPhoneNumberMock.mockReturnValue([mockUpdateUserPhoneNumberMutation, false])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("disclaimer", () => {
    describe("when the user is not registered", () => {
      it("displays a checkbox", () => {
        renderWithRelay({ SaleArtwork: () => saleArtwork })

        expect(screen.getByTestId("disclaimer-checkbox")).toBeOnTheScreen()
      })

      it("displays a disclaimer", () => {
        renderWithRelay({ SaleArtwork: () => saleArtwork })

        expect(screen.getByTestId("disclaimer")).toHaveTextContent(
          /I agree to Artsy's and Christie's General Terms and Conditions of Sale. I understand that all bids are binding and may not be retracted./
        )
      })

      it("navigates to the conditions of sale when the user taps the link", () => {
        renderWithRelay({ SaleArtwork: () => saleArtwork })

        fireEvent.press(
          screen.getByText("Artsy's and Christie's General Terms and Conditions of Sale")
        )

        expect(navigateSpy).toHaveBeenCalledWith("/terms")
      })
    })

    describe("when the user is registered", () => {
      it("does not display a checkbox", () => {
        renderWithRelay({ SaleArtwork: () => saleArtworkRegisteredForBidding })

        expect(screen.queryByTestId("disclaimer-checkbox")).not.toBeOnTheScreen()
      })

      it("displays a disclaimer", () => {
        renderWithRelay({ SaleArtwork: () => saleArtworkRegisteredForBidding })

        expect(
          screen.getByText(
            /I agree to Artsy's and Christie's General Terms and Conditions of Sale. I understand that all bids are binding and may not be retracted./
          )
        ).toBeOnTheScreen()
      })

      it("navigates to the conditions of sale when the user taps the link", () => {
        renderWithRelay({ SaleArtwork: () => saleArtworkRegisteredForBidding })

        fireEvent.press(
          screen.getByText("Artsy's and Christie's General Terms and Conditions of Sale")
        )

        expect(navigateSpy).toHaveBeenCalledWith("/terms")
      })
    })
  })

  it("enables the bid button when checkbox is ticked", () => {
    renderWithRelay({
      Me: () => ({ hasQualifiedCreditCards: true }),
      SaleArtwork: () => saleArtwork,
    })

    expect(screen.getByTestId("bid-button")).toBeDisabled()

    fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

    expect(screen.getByTestId("bid-button")).toBeEnabled()
  })

  it("enables the bid button by default if the user is registered", () => {
    renderWithRelay({ SaleArtwork: () => saleArtworkRegisteredForBidding })

    expect(screen.getByTestId("bid-button")).toBeEnabled()
  })

  it("displays the artwork title correctly with date", () => {
    renderWithRelay({ SaleArtwork: () => saleArtwork })

    expect(screen.getByText("Meteor Shower, 2015")).toBeOnTheScreen()
  })

  it("displays the artwork title correctly without date", () => {
    const datelessSaleArtwork = merge({}, saleArtwork, { artwork: { date: null } })

    renderWithRelay({ SaleArtwork: () => datelessSaleArtwork })

    expect(screen.queryByText("Meteor Shower, 2015")).not.toBeOnTheScreen()
    expect(screen.getByText("Meteor Shower")).toBeOnTheScreen()
  })

  it("can load and display price summary", async () => {
    const { mockResolveLastOperation } = renderWithRelay({ SaleArtwork: () => saleArtwork })

    expect(screen.getByTestId("default-loading-feedback")).toBeOnTheScreen()

    mockResolveLastOperation({
      SaleArtwork: () => ({
        calculatedCost: {
          buyersPremium: { display: "$9,000.00" },
          subtotal: { display: "$54,000.00" },
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("default-loading-feedback"))

    expect(screen.getByText("Your max bid")).toBeOnTheScreen()
    expect(screen.getByText("$45,000.00")).toBeOnTheScreen()

    expect(screen.getByText("Buyer’s premium")).toBeOnTheScreen()
    expect(screen.getByText("$9,000.00")).toBeOnTheScreen()

    expect(screen.getByText("Subtotal")).toBeOnTheScreen()
    expect(screen.getByText("$54,000.00")).toBeOnTheScreen()
  })

  describe("checkbox and payment info display", () => {
    it("shows no checkbox or payment info if the user is registered", () => {
      renderWithRelay({ SaleArtwork: () => saleArtworkRegisteredForBidding })

      expect(screen.queryByTestId("disclaimer-checkbox")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("payment-info-row")).not.toBeOnTheScreen()
      expect(screen.getByText(/I agree to/)).toBeOnTheScreen()
    })

    it("shows a checkbox but no payment info if the user is not registered and has cc on file", () => {
      renderWithRelay({ SaleArtwork: () => saleArtwork })

      expect(screen.getByTestId("disclaimer-checkbox")).toBeOnTheScreen()
      expect(screen.queryByTestId("payment-info-row")).not.toBeOnTheScreen()
    })

    it("shows a checkbox and payment info if the user is not registered and has no cc on file", async () => {
      renderWithRelay({
        Me: () => ({ hasQualifiedCreditCards: false }),
        SaleArtwork: () => saleArtwork,
      })

      expect(screen.getByTestId("disclaimer-checkbox")).toBeOnTheScreen()
      expect(screen.getByText("Max bid")).toBeOnTheScreen()
      expect(screen.getByText("Credit card")).toBeOnTheScreen()
    })
  })

  describe("when pressing bid button", () => {
    it("commits mutation", () => {
      renderWithRelay({
        Me: () => ({ hasQualifiedCreditCards: true }),
        SaleArtwork: () => saleArtwork,
      })

      fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

      fireEvent.press(screen.getByTestId("bid-button"))
      expect(mockTrackEvent).toHaveBeenCalledWith({ action_type: "tap", action_name: "placeBid" })
      expect(mockCreateBidderMutation).toHaveBeenCalled()
    })

    it("shows a spinner", () => {
      useCreateBidderPositionMock.mockReturnValue([mockCreateBidderMutation, true])

      renderWithRelay({ SaleArtwork: () => saleArtwork })

      fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

      const placeBidButton = screen.UNSAFE_getByType(Button)

      fireEvent.press(placeBidButton)

      expect(placeBidButton.props.loading).toEqual(true)
    })

    it("disables tap events while a spinner is being shown", () => {
      const navigator = { push: jest.fn(), pop: jest.fn() }
      useCreateBidderPositionMock.mockReturnValue([mockCreateBidderMutation, true])

      renderWithRelay({ SaleArtwork: () => saleArtwork }, { navigator })

      const yourMaxBidRow = screen.getByText("Max bid")
      const conditionsOfSaleLink = screen.getByText(
        "Artsy's and Christie's General Terms and Conditions of Sale"
      )
      const conditionsOfSaleCheckbox = screen.UNSAFE_getByType(Checkbox)

      fireEvent.press(conditionsOfSaleCheckbox)
      fireEvent.press(screen.getByTestId("bid-button"))

      fireEvent.press(yourMaxBidRow)

      expect(navigator.push).not.toHaveBeenCalled()

      fireEvent.press(conditionsOfSaleLink)

      expect(navigateSpy).not.toHaveBeenCalled()

      expect(conditionsOfSaleCheckbox.props.disabled).toEqual(true)
    })

    describe("when pressing bid", () => {
      it("commits the mutation", () => {
        renderWithRelay({ SaleArtwork: () => saleArtwork })

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
        )

        fireEvent.press(screen.getByTestId("bid-button"))

        expect(useCreateBidderPosition).toHaveBeenCalled()
      })

      describe("when mutation fails", () => {
        it("does not verify bid position", () => {
          // Probably due to a network problem.
          renderWithRelay({
            Me: () => ({ hasQualifiedCreditCards: true }),
            SaleArtwork: () => saleArtwork,
          })

          fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

          relay.commitMutation = commitMutationMock((_, { onError }) => {
            onError!(new Error("An error occurred."))
            return { dispose: jest.fn() }
          }) as any

          fireEvent.press(screen.getByTestId("bid-button"))

          expect(useCreateBidderPosition).toHaveBeenCalled()
          expect(bidderPositionQueryMock).not.toHaveBeenCalled()
        })

        it("displays an error message on a network failure", () => {
          const captureMessageSpy = jest.spyOn(Sentry, "captureMessage")
          const erroredCreateBidderPositionMutation = jest
            .fn()
            .mockImplementation(({ onError }) => {
              onError(new Error("Network request failed"))
            })
          useCreateBidderPositionMock.mockReturnValue([erroredCreateBidderPositionMutation, false])

          renderWithRelay({
            Me: () => ({ hasQualifiedCreditCards: true }),
            SaleArtwork: () => saleArtwork,
          })

          fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

          fireEvent.press(screen.getByTestId("bid-button"))

          expect(captureMessageSpy).toHaveBeenCalledWith(
            expect.stringContaining("#createBidderPosition"),
            "error"
          )
          expect(mockNavigator.navigate).toHaveBeenCalledWith(
            "BidResult",
            expect.objectContaining({
              bidderPositionResult: {
                messageHeader: "An error occurred",
                messageDescriptionMD:
                  "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
                position: null,
                status: "ERROR",
              },
            })
          )
        })

        it("displays an error message on a createBidderPosition mutation failure", async () => {
          const captureMessageSpy = jest.spyOn(Sentry, "captureMessage")
          const error = {
            message:
              'GraphQL Timeout Error: Mutation.createBidderPosition has timed out after waiting for 5000ms"}',
          }

          const erroredCreateBidderPositionMutation = jest
            .fn()
            .mockImplementation(({ onCompleted }) => {
              onCompleted({}, [error])
            })
          useCreateBidderPositionMock.mockReturnValue([erroredCreateBidderPositionMutation, false])

          renderWithRelay({
            Me: () => ({ hasQualifiedCreditCards: true }),
            SaleArtwork: () => saleArtwork,
          })

          fireEvent.press(screen.getByTestId("disclaimer-checkbox"))
          fireEvent.press(screen.getByTestId("bid-button"))

          expect(captureMessageSpy).toHaveBeenCalledWith(
            expect.stringContaining("GraphQL Timeout Error"),
            "error"
          )

          await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

          expect(mockNavigator.navigate).toHaveBeenCalledWith(
            "BidResult",
            expect.objectContaining({
              bidderPositionResult: {
                messageHeader: "An error occurred",
                messageDescriptionMD:
                  "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
                position: null,
                status: "ERROR",
              },
            })
          )
        })
      })
    })
  })

  describe("editing bid amount", () => {
    it("allows you to go to the max bid edit screen and select a new max bid", () => {
      renderWithRelay({ SaleArtwork: () => saleArtworkRegisteredForBidding })

      fireEvent.press(screen.getByText("Edit"))
      expect(mockNavigator.goBack).toHaveBeenCalled()

      expect(mockStore.getState().selectedBidIndex).toEqual(0)
      expect(mockStore.getState().selectedBid).toEqual({ cents: 450000, display: "$45,000" })

      mockStore.getActions().setSelectedBidIndex(1)

      expect(mockStore.getState().selectedBidIndex).toEqual(1)
      expect(mockStore.getState().selectedBid).toEqual({ cents: 460000, display: "$46,000" })
    })
  })

  describe("polling to verify bid position", () => {
    describe("bid success", () => {
      it("polls for new results", async () => {
        const completedCreateBidderPositionMutation = jest
          .fn()
          .mockImplementation(({ onCompleted }) => {
            onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
          })
        useCreateBidderPositionMock.mockReturnValue([completedCreateBidderPositionMutation, false])

        renderWithRelay({
          Me: () => ({ hasQualifiedCreditCards: true }),
          SaleArtwork: () => saleArtwork,
        })

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        let requestCounter = 0 // On the fifth attempt, return highestBidder

        bidderPositionQueryMock.mockImplementation(() => {
          requestCounter++
          if (requestCounter > 5) {
            return Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
          } else {
            return Promise.resolve(mockRequestResponses.pollingForBid.pending)
          }
        })

        fireEvent.press(screen.getByTestId("bid-button"))

        await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

        expect(mockTrackEvent).toHaveBeenCalledWith({
          action_type: "success",
          action_name: "placeBid",
        })
        expect(mockNavigator.navigate).toHaveBeenCalledWith(
          "BidResult",
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.pollingForBid.highestBidder.me!.bidderPosition,
          })
        )
      })

      it("shows error when polling attempts exceed max", async () => {
        const completedCreateBidderPositionMutation = jest
          .fn()
          .mockImplementation(({ onCompleted }) => {
            onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
          })
        useCreateBidderPositionMock.mockReturnValue([completedCreateBidderPositionMutation, false])

        renderWithRelay({
          Me: () => ({ hasQualifiedCreditCards: true }),
          SaleArtwork: () => saleArtwork,
        })

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValue(
          Promise.resolve(mockRequestResponses.pollingForBid.pending)
        )

        fireEvent.press(screen.getByTestId("bid-button"))
        await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

        expect(mockNavigator.navigate).toHaveBeenCalledWith(
          "BidResult",
          expect.objectContaining({
            bidderPositionResult: mockRequestResponses.pollingForBid.pending.me!.bidderPosition,
          })
        )
      })

      it("shows successful bid result when highest bidder", async () => {
        const completedCreateBidderPositionMutation = jest
          .fn()
          .mockImplementation(({ onCompleted }) => {
            onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
          })
        useCreateBidderPositionMock.mockReturnValue([completedCreateBidderPositionMutation, false])

        renderWithRelay({
          Me: () => ({ hasQualifiedCreditCards: true }),
          SaleArtwork: () => saleArtwork,
        })

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
        )

        fireEvent.press(screen.getByTestId("bid-button"))
        await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

        expect(mockNavigator.navigate).toHaveBeenCalledWith(
          "BidResult",
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.pollingForBid.highestBidder.me!.bidderPosition,
          })
        )
      })

      it("shows outbid bidSuccessResult when outbid", async () => {
        const completedCreateBidderPositionMutation = jest
          .fn()
          .mockImplementation(({ onCompleted }) => {
            onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
          })
        useCreateBidderPositionMock.mockReturnValue([completedCreateBidderPositionMutation, false])

        renderWithRelay({
          Me: () => ({ hasQualifiedCreditCards: true }),
          SaleArtwork: () => saleArtwork,
        })

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.outbid)
        )

        fireEvent.press(screen.getByTestId("bid-button"))
        await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

        expect(mockNavigator.navigate).toHaveBeenCalledWith(
          "BidResult",
          expect.objectContaining({
            bidderPositionResult: mockRequestResponses.pollingForBid.outbid.me!.bidderPosition,
          })
        )
      })

      it("shows reserve not met when reserve is not met", async () => {
        const completedCreateBidderPositionMutation = jest
          .fn()
          .mockImplementation(({ onCompleted }) => {
            onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
          })
        useCreateBidderPositionMock.mockReturnValue([completedCreateBidderPositionMutation, false])

        renderWithRelay({
          Me: () => ({ hasQualifiedCreditCards: true }),
          SaleArtwork: () => saleArtwork,
        })

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet)
        )

        fireEvent.press(screen.getByTestId("bid-button"))
        await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

        expect(mockNavigator.navigate).toHaveBeenCalledWith(
          "BidResult",
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.pollingForBid.reserveNotMet.me!.bidderPosition,
          })
        )
      })

      it("updates the main auction screen", async () => {
        const completedCreateBidderPositionMutation = jest
          .fn()
          .mockImplementation(({ onCompleted }) => {
            onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
          })
        useCreateBidderPositionMock.mockReturnValue([completedCreateBidderPositionMutation, false])

        renderWithRelay({
          Me: () => ({ hasQualifiedCreditCards: true }),
          SaleArtwork: () => saleArtwork,
        })

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet)
        )

        fireEvent.press(screen.getByTestId("bid-button"))
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
        expect(mockNavigator.navigate).toHaveBeenCalledWith(
          "BidResult",
          expect.objectContaining({
            bidderPositionResult: {
              position: {
                internalID: "bidder-position-id-from-polling",
              },
              status: "RESERVE_NOT_MET",
            },
            saleArtwork: expect.objectContaining({
              artwork: {
                artistNames: "Makiko Kudo",
                date: "2015",
                slug: "meteor-shower",
                title: "Meteor Shower",
                image: {
                  url: "https://d32dm0rphc51dk.cloudfront.net/5RvuM9YF68AyD8OgcdLw7g/small.jpg",
                },
              },
              endAt: null,
              extendedBiddingEndAt: null,
              id: "node-id",
              internalID: "internal-id",
              lotLabel: "538",
              sale: {
                bidder: null,
                cascadingEndTimeIntervalMinutes: null,
                endAt: "2018-05-10T20:22:42+00:00",
                internalID: "internal-id",
                isBenefit: false,
                liveStartAt: "2018-05-09T20:22:42+00:00",
                partner: {
                  name: "Christie's",
                },
                slug: "best-art-sale-in-town",
              },
            }),
          })
        )
      })
    })

    describe("bid failure", () => {
      it("shows the error screen with a failure", async () => {
        const completedCreateBidderPositionMutation = jest
          .fn()
          .mockImplementation(({ onCompleted }) => {
            onCompleted(mockRequestResponses.placingBid.bidRejected, null)
          })
        useCreateBidderPositionMock.mockReturnValue([completedCreateBidderPositionMutation, false])

        renderWithRelay({
          Me: () => ({ hasQualifiedCreditCards: true }),
          SaleArtwork: () => saleArtwork,
        })

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        fireEvent.press(screen.getByTestId("bid-button"))

        await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

        expect(mockNavigator.navigate).toHaveBeenCalledWith(
          "BidResult",
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.placingBid.bidRejected.createBidderPosition!.result,
          })
        )
      })
    })
  })

  describe("ConfirmBid for unqualified user", () => {
    const mockFillAndSubmit = () => {
      // updating bid flow state
      mockStore.getActions().setBillingAddress(billingAddress)
      mockStore.getActions().setCreditCardToken(stripeToken.token as any)

      // check the checkbox and press the Bid button
      fireEvent.press(screen.getByTestId("disclaimer-checkbox"))
      fireEvent.press(screen.getByTestId("bid-button"))
    }

    it("shows the credit card form when the user tap the edit text in the credit card row", () => {
      renderWithRelay({
        Me: () => ({ hasQualifiedCreditCards: false }),
        SaleArtwork: () => saleArtwork,
      })

      fireEvent.press(screen.getByText("Add"))

      expect(mockNavigator.navigate).toHaveBeenCalledWith("CreditCardForm", expect.any(Object))
    })

    it("shows the error screen when stripe's API returns an error", async () => {
      const captureMessageSpy = jest.spyOn(Sentry, "captureMessage")
      const erroredCreateCreditCardMutation = jest.fn().mockImplementation(({ onCompleted }) => {
        onCompleted({}, [new Error("Stripe API error")])
      })
      useCreateCreditCardMock.mockReturnValue([erroredCreateCreditCardMutation, false])

      renderWithRelay({
        Me: () => ({ hasQualifiedCreditCards: false }),
        SaleArtwork: () => saleArtwork,
      })

      mockFillAndSubmit()

      // wait for modal to be displayed
      await screen.findByText(
        "There was a problem processing your information. Check your payment details and try again."
      )

      expect(captureMessageSpy).toHaveBeenCalledWith(
        expect.stringContaining("#createCreditCard error"),
        "error"
      )

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(
        screen.queryByText(
          "There was a problem processing your information. Check your payment details and try again."
        )
      ).not.toBeOnTheScreen()
    })

    it("shows the error screen with the correct error message on a createCreditCard mutation failure", async () => {
      const captureMessageSpy = jest.spyOn(Sentry, "captureMessage")
      const erroredCreateCreditCardMutation = jest.fn().mockImplementation(({ onCompleted }) => {
        onCompleted(mockRequestResponses.creatingCreditCardError, null)
      })
      useCreateCreditCardMock.mockReturnValue([erroredCreateCreditCardMutation, false])

      renderWithRelay({
        Me: () => ({ hasQualifiedCreditCards: false }),
        SaleArtwork: () => saleArtwork,
      })

      mockFillAndSubmit()

      await screen.findByText("Your card's security code is incorrect.")

      expect(captureMessageSpy).toHaveBeenCalledWith(
        expect.stringContaining("Your card's security code is incorrect"),
        "error"
      )

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(screen.queryByText("Your card's security code is incorrect.")).not.toBeOnTheScreen()
    })

    it("shows the error screen with the default error message if there are unhandled errors from the createCreditCard mutation", async () => {
      const captureMessageSpy = jest.spyOn(Sentry, "captureMessage")

      const errors = [{ message: "malformed error" }]
      const erroredCreateCreditCardMutation = jest.fn().mockImplementation(({ onCompleted }) => {
        onCompleted({}, errors)
      })
      useCreateCreditCardMock.mockReturnValue([erroredCreateCreditCardMutation, false])

      renderWithRelay({
        Me: () => ({ hasQualifiedCreditCards: false }),
        SaleArtwork: () => saleArtwork,
      })

      mockFillAndSubmit()

      await screen.findByText(
        "There was a problem processing your information. Check your payment details and try again."
      )

      expect(captureMessageSpy).toHaveBeenCalledWith(
        expect.stringContaining("malformed error"),
        "error"
      )

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(
        screen.queryByText(
          "There was a problem processing your information. Check your payment details and try again."
        )
      ).not.toBeOnTheScreen()
    })

    it("shows the error screen with the default error message if the creditCardMutation error message is empty", async () => {
      const captureMessageSpy = jest.spyOn(Sentry, "captureMessage")

      const erroredCreateCreditCardMutation = jest.fn().mockImplementation(({ onCompleted }) => {
        onCompleted(mockRequestResponses.creatingCreditCardEmptyError, null)
      })
      useCreateCreditCardMock.mockReturnValue([erroredCreateCreditCardMutation, false])

      renderWithRelay({
        Me: () => ({ hasQualifiedCreditCards: false }),
        SaleArtwork: () => saleArtwork,
      })

      mockFillAndSubmit()

      await screen.findByText(
        "There was a problem processing your information. Check your payment details and try again."
      )

      expect(captureMessageSpy).toHaveBeenCalledWith(
        expect.stringContaining("Payment information could not be processed"),
        "error"
      )

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(
        screen.queryByText(
          "There was a problem processing your information. Check your payment details and try again."
        )
      ).not.toBeOnTheScreen()
    })

    it("shows the generic error screen on a createCreditCard mutation network failure", async () => {
      const captureMessageSpy = jest.spyOn(Sentry, "captureMessage")
      const erroredCreateCreditCardMutation = jest.fn().mockImplementation(({ onError }) => {
        onError(new TypeError("Network request failed"))
      })
      useCreateCreditCardMock.mockReturnValue([erroredCreateCreditCardMutation, false])

      renderWithRelay({
        Me: () => ({ hasQualifiedCreditCards: false }),
        SaleArtwork: () => saleArtwork,
      })

      mockFillAndSubmit()

      await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

      expect(captureMessageSpy).toHaveBeenCalledWith(
        expect.stringContaining("#createCreditCard"),
        "error"
      )
      expect(mockNavigator.navigate).toHaveBeenCalledWith(
        "BidResult",
        expect.objectContaining({
          bidderPositionResult: {
            messageHeader: "An error occurred",
            messageDescriptionMD:
              "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
            position: null,
            status: "ERROR",
          },
        })
      )
    })

    describe("After successful mutations", () => {
      const completedUpdateUserPhoneNumberMutation = jest
        .fn()
        .mockImplementation(({ onCompleted }) => {
          onCompleted(mockRequestResponses.updateMyUserProfile, null)
        })

      const completedCreateCreditCardMutation = jest.fn().mockImplementation(({ onCompleted }) => {
        onCompleted(mockRequestResponses.creatingCreditCardSuccess, null)
      })
      const completedCreateBidderPositionMutation = jest
        .fn()
        .mockImplementation(({ onCompleted }) => {
          onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
        })

      beforeEach(() => {
        useUpdateUserPhoneNumberMock.mockReturnValue([
          completedUpdateUserPhoneNumberMutation,
          false,
        ])
        useCreateCreditCardMock.mockReturnValue([completedCreateCreditCardMutation, false])
        useCreateBidderPositionMock.mockReturnValue([completedCreateBidderPositionMutation, false])
      })

      it("commits two mutations, createCreditCard followed by createBidderPosition on a successful bid", async () => {
        bidderPositionQueryMock
          .mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.pending))
          .mockReturnValueOnce(Promise.resolve(mockRequestResponses.pollingForBid.highestBidder))

        renderWithRelay({
          Me: () => ({ hasQualifiedCreditCards: false }),
          SaleArtwork: () => saleArtwork,
        })

        mockFillAndSubmit()

        expect(completedUpdateUserPhoneNumberMutation).toHaveBeenCalledWith(
          expect.objectContaining({ variables: { input: { phone: "111 222 4444" } } })
        )

        expect(completedCreateCreditCardMutation).toHaveBeenCalledWith(
          expect.objectContaining({ variables: { input: { token: "fake-token" } } })
        )

        await waitFor(() => expect(completedCreateBidderPositionMutation).toHaveBeenCalled())

        expect(completedCreateBidderPositionMutation).toHaveBeenCalledWith(
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
        const captureExceptionSpy = jest.spyOn(Sentry, "captureException")
        bidderPositionQueryMock.mockReturnValueOnce(Promise.reject({ message: "error" }))

        renderWithRelay({
          Me: () => ({ hasQualifiedCreditCards: false }),
          SaleArtwork: () => saleArtwork,
        })

        mockFillAndSubmit()

        await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

        expect(captureExceptionSpy).toHaveBeenCalledWith(
          { message: "error" },
          { tags: { source: "ConfirmBid.tsx: verifyBidderPosition" } }
        )
        expect(mockNavigator.navigate).toHaveBeenCalledWith(
          "BidResult",
          expect.objectContaining({
            bidderPositionResult: {
              messageHeader: "An error occurred",
              messageDescriptionMD:
                "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
              position: null,
              status: "ERROR",
            },
          })
        )
      })
    })
  })

  describe("cascading end times", () => {
    it("sale endtime defaults to extendedBiddingEndtime", () => {
      renderWithRelay({ SaleArtwork: () => cascadingEndTimeSaleArtwork })

      expect(screen.getByText("00d 00h 00m 10s")).toBeOnTheScreen()
    })

    it("shows the sale's end time if the sale does not have cascading end times", () => {
      renderWithRelay({ SaleArtwork: () => nonCascadeSaleArtwork })

      expect(screen.getByText("00d 00h 00m 10s")).toBeOnTheScreen()
    })
  })

  const baseSaleArtwork = {
    id: "node-id",
    internalID: "internal-id",
    artwork: {
      slug: "meteor-shower",
      title: "Meteor Shower",
      date: "2015",
      artistNames: "Makiko Kudo",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/5RvuM9YF68AyD8OgcdLw7g/small.jpg",
      },
    },
    sale: {
      internalID: "internal-id",
      slug: "best-art-sale-in-town",
      startAt: "2018-05-08T20:22:42+00:00",
      endAt: "2018-05-10T20:22:42+00:00",
      isBenefit: false,
      partner: {
        name: "Christie's",
      },
      bidder: null,
    },
    lotLabel: "538",
  }

  const saleArtwork: CleanRelayFragment<ConfirmBid_saleArtwork$data> = {
    ...baseSaleArtwork,
    endAt: null,
    extendedBiddingEndAt: null,
    sale: {
      ...baseSaleArtwork.sale,
      liveStartAt: "2018-05-09T20:22:42+00:00",
      cascadingEndTimeIntervalMinutes: null,
    },
  }

  const nonCascadeSaleArtwork: CleanRelayFragment<ConfirmBid_saleArtwork$data> = {
    ...baseSaleArtwork,
    endAt: null,
    extendedBiddingEndAt: null,
    sale: {
      ...baseSaleArtwork.sale,
      endAt: new Date(Date.now() + 10000).toISOString(),
      liveStartAt: null,
      cascadingEndTimeIntervalMinutes: null,
    },
  }

  const cascadingEndTimeSaleArtwork: CleanRelayFragment<ConfirmBid_saleArtwork$data> = {
    ...saleArtwork,
    endAt: "2018-05-13T20:22:42+00:00",
    extendedBiddingEndAt: new Date(Date.now() + 10000).toISOString(),
    sale: {
      ...baseSaleArtwork.sale,
      liveStartAt: null,
      cascadingEndTimeIntervalMinutes: 1,
    },
  }

  const saleArtworkRegisteredForBidding: CleanRelayFragment<ConfirmBid_saleArtwork$data> = {
    ...saleArtwork,
    endAt: "2018-05-13T20:22:42+00:00",
    extendedBiddingEndAt: null,
    sale: {
      ...baseSaleArtwork.sale,
      liveStartAt: null,
      cascadingEndTimeIntervalMinutes: null,
      bidder: {
        id: "1234567",
      },
    },
  }

  const mockRequestResponses = {
    updateMyUserProfile: {
      updateMyUserProfile: {
        user: {
          phone: "111 222 4444",
        },
      },
    } as useUpdateUserPhoneNumberMutation["response"],
    creatingCreditCardSuccess: {
      createCreditCard: {
        creditCardOrError: {
          creditCard: {
            internalID: "new-credit-card",
            id: "",
            brand: "VISA",
            name: "TEST",
            lastDigits: "4242",
            expirationMonth: 1,
            expirationYear: 2020,
          },
        },
      },
    } as useCreateCreditCardMutation["response"],
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
    } as useCreateCreditCardMutation["response"],
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
    } as useCreateCreditCardMutation["response"],
    placingBid: {
      bidAccepted: {
        createBidderPosition: {
          result: {
            status: "SUCCESS",
            messageHeader: "Success",
            messageDescriptionMD: "",
            position: {
              internalID: "bidder-position-id-from-mutation",
            },
          },
        },
      } as useCreateBidderPositionMutation["response"],
      bidRejected: {
        createBidderPosition: {
          result: {
            status: "ERROR",
            messageHeader: "An error occurred",
            messageDescriptionMD: "Some markdown description",
          },
        },
      } as useCreateBidderPositionMutation["response"],
    },
    pollingForBid: {
      highestBidder: {
        me: {
          bidderPosition: {
            status: "WINNING",
            position: {
              internalID: "bidder-position-id-from-polling",
            },
          },
        },
      } as BidderPositionQuery$data,
      outbid: {
        me: {
          bidderPosition: {
            status: "OUTBID",
            position: {
              internalID: "bidder-position-id-from-polling",
            },
          },
        },
      } as BidderPositionQuery$data,
      pending: {
        me: {
          bidderPosition: {
            position: {
              internalID: "bidder-position-id-from-polling",
            },
            status: "PENDING",
          },
        },
      } as BidderPositionQuery$data,
      reserveNotMet: {
        me: {
          bidderPosition: {
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
})
