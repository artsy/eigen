import { Button, Checkbox, Text } from "@artsy/palette-mobile"
import { createToken } from "@stripe/stripe-react-native"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { BidderPositionQuery$data } from "__generated__/BidderPositionQuery.graphql"
import { ConfirmBid_saleArtwork$data } from "__generated__/ConfirmBid_saleArtwork.graphql"
import { useCreateBidderPositionMutation } from "__generated__/useCreateBidderPositionMutation.graphql"
import { useCreateCreditCardMutation } from "__generated__/useCreateCreditCardMutation.graphql"
import { useUpdateUserPhoneNumberMutation } from "__generated__/useUpdateUserPhoneNumberMutation.graphql"
import { FakeNavigator } from "app/Components/Bidding/Helpers/FakeNavigator"
import { ConfirmBid, ConfirmBidProps } from "app/Components/Bidding/Screens/ConfirmBid"
import { bidderPositionQuery } from "app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
import { Address } from "app/Components/Bidding/types"
import { Modal } from "app/Components/Modal"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import * as navigation from "app/system/navigation/navigate"
import NavigatorIOS, {
  NavigatorIOSPushArgs,
} from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { useCreateBidderPosition } from "app/utils/mutations/useCreateBidderPosition"
import { useCreateCreditCard } from "app/utils/mutations/useCreateCreditCard"
import { useUpdateUserPhoneNumber } from "app/utils/mutations/useUpdateUserPhoneNumber"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { merge } from "lodash"
import { TouchableWithoutFeedback } from "react-native"
import relay, { graphql } from "react-relay"
import { ReactTestRenderer } from "react-test-renderer"
import { BidResult } from "./BidResult"
import { CreditCardForm } from "./CreditCardForm"
import { SelectMaxBid } from "./SelectMaxBid"

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

  let nextStep: NavigatorIOSPushArgs | null
  const mockNavigator: Partial<NavigatorIOS> = { push: (route) => (nextStep = route) }

  const mockPostNotificationName = LegacyNativeModules.ARNotificationsManager
    .postNotificationName as jest.Mock

  const findPlaceBidButton = (component: ReactTestRenderer) => {
    return component.root.findByProps({ testID: "bid-button" })
  }

  const mockCreateBidderMutation = jest.fn()
  const useCreateBidderPositionMock = useCreateBidderPosition as jest.Mock<any>
  const mockCreateCreditCardMutation = jest.fn()
  const useCreateCreditCardMock = useCreateCreditCard as jest.Mock<any>
  const mockUpdateUserPhoneNumberMutation = jest.fn()
  const useUpdateUserPhoneNumberMock = useUpdateUserPhoneNumber as jest.Mock
  const navigateSpy = jest.spyOn(navigation, "navigate")

  // const mountConfirmBidComponent = (props: ConfirmBidProps) => {
  //   return renderWithWrappersLEGACY(<ConfirmBid {...props} />)
  // }

  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => {
      return <ConfirmBid {...props} me={props.me} saleArtwork={props.artwork.saleArtwork} />
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
    nextStep = null // reset nextStep between tests
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
        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

        expect(screen.getByTestId("disclaimer-checkbox")).toBeOnTheScreen()
      })

      it("displays a disclaimer", () => {
        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

        expect(screen.getByTestId("disclaimer")).toHaveTextContent(
          /I agree to Artsy's and Christie's General Terms and Conditions of Sale. I understand that all bids are binding and may not be retracted./
        )
      })

      it("navigates to the conditions of sale when the user taps the link", () => {
        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

        fireEvent.press(
          screen.getByText("Artsy's and Christie's General Terms and Conditions of Sale")
        )

        expect(navigateSpy).toHaveBeenCalledWith("/terms")
      })
    })

    describe("when the user is registered", () => {
      it("does not display a checkbox", () => {
        renderWithRelay(
          {
            Me: () => ({ hasQualifiedCreditCards: true }),
            SaleArtwork: () => saleArtworkRegisteredForBidding,
          },
          initialProps
        )

        expect(screen.queryByTestId("disclaimer-checkbox")).not.toBeOnTheScreen()
      })

      it("displays a disclaimer", () => {
        renderWithRelay(
          {
            Me: () => ({ hasQualifiedCreditCards: true }),
            SaleArtwork: () => saleArtworkRegisteredForBidding,
          },
          initialProps
        )

        expect(
          screen.getByText(
            /I agree to Artsy's and Christie's General Terms and Conditions of Sale. I understand that all bids are binding and may not be retracted./
          )
        ).toBeOnTheScreen()
      })

      it("navigates to the conditions of sale when the user taps the link", () => {
        renderWithRelay(
          {
            Me: () => ({ hasQualifiedCreditCards: true }),
            SaleArtwork: () => saleArtworkRegisteredForBidding,
          },
          initialProps
        )

        fireEvent.press(
          screen.getByText("Artsy's and Christie's General Terms and Conditions of Sale")
        )

        expect(navigateSpy).toHaveBeenCalledWith("/terms")
      })
    })
  })

  it("enables the bid button when checkbox is ticked", () => {
    renderWithRelay(
      {
        Me: () => ({ hasQualifiedCreditCards: true }),
        SaleArtwork: () => saleArtwork,
      },
      initialProps
    )

    expect(screen.getByTestId("bid-button")).toBeDisabled()

    fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

    expect(screen.getByTestId("bid-button")).toBeEnabled()
  })

  it("enables the bid button by default if the user is registered", () => {
    renderWithRelay({ SaleArtwork: () => saleArtworkRegisteredForBidding }, initialProps)

    expect(screen.getByTestId("bid-button")).toBeEnabled()
  })

  it("displays the artwork title correctly with date", () => {
    renderWithRelay({ SaleArtwork: () => saleArtwork }, initialProps)

    expect(screen.getByText("Meteor Shower, 2015")).toBeOnTheScreen()
  })

  it("displays the artwork title correctly without date", () => {
    const datelessSaleArtwork = merge({}, saleArtwork, { artwork: { date: null } })

    renderWithRelay({ SaleArtwork: () => datelessSaleArtwork }, initialProps)

    expect(screen.queryByText("Meteor Shower, 2015")).not.toBeOnTheScreen()
    expect(screen.getByText("Meteor Shower")).toBeOnTheScreen()
  })

  it("can load and display price summary", async () => {
    const { mockResolveLastOperation } = renderWithRelay(
      {
        Me: () => ({ hasQualifiedCreditCards: true }),
        SaleArtwork: () => saleArtwork,
      },
      initialProps
    )

    expect(screen.getByTestId("relay-loading")).toBeOnTheScreen()

    mockResolveLastOperation({
      SaleArtwork: () => ({
        calculatedCost: {
          buyersPremium: { display: "$9,000.00" },
          subtotal: { display: "$54,000.00" },
        },
      }),
    })

    expect(screen.getByText("Your max bid")).toBeOnTheScreen()
    expect(screen.getByText("$45,000.00")).toBeOnTheScreen()

    expect(screen.getByText("Buyer’s premium")).toBeOnTheScreen()
    expect(screen.getByText("$9,000.00")).toBeOnTheScreen()

    expect(screen.getByText("Subtotal")).toBeOnTheScreen()
    expect(screen.getByText("$54,000.00")).toBeOnTheScreen()
  })

  describe("checkbox and payment info display", () => {
    it("shows no checkbox or payment info if the user is registered", () => {
      renderWithRelay({ SaleArtwork: () => saleArtworkRegisteredForBidding }, initialProps)

      expect(screen.queryByTestId("disclaimer-checkbox")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("payment-info-row")).not.toBeOnTheScreen()
      expect(screen.getByText(/I agree to/)).toBeOnTheScreen()
    })

    it("shows a checkbox but no payment info if the user is not registered and has cc on file", () => {
      renderWithRelay(
        {
          SaleArtwork: () => saleArtwork,
        },
        initialProps
      )

      expect(screen.getByTestId("disclaimer-checkbox")).toBeOnTheScreen()
      expect(screen.queryByTestId("payment-info-row")).not.toBeOnTheScreen()
    })

    it("shows a checkbox and payment info if the user is not registered and has no cc on file", async () => {
      renderWithRelay(
        {
          Me: () => ({ hasQualifiedCreditCards: false }),
          SaleArtwork: () => saleArtwork,
        },
        initialProps
      )

      expect(screen.getByTestId("disclaimer-checkbox")).toBeOnTheScreen()
      expect(screen.getByText("Max bid")).toBeOnTheScreen()
      expect(screen.getByText("Credit card")).toBeOnTheScreen()
    })
  })

  describe("when pressing bid button", () => {
    it("commits mutation", () => {
      renderWithRelay(
        {
          Me: () => ({ hasQualifiedCreditCards: true }),
          SaleArtwork: () => saleArtwork,
        },
        initialProps
      )

      fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

      fireEvent.press(screen.getByTestId("bid-button"))
      expect(mockCreateBidderMutation).toHaveBeenCalled()
    })

    it("shows a spinner", async () => {
      useCreateBidderPositionMock.mockReturnValue([mockCreateBidderMutation, true])

      renderWithRelay(
        {
          Me: () => ({ hasQualifiedCreditCards: true }),
          SaleArtwork: () => saleArtwork,
        },
        initialProps
      )

      fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

      const button = screen.UNSAFE_getByType(Button)

      fireEvent.press(button)

      expect(button.props.loading).toEqual(true)
    })

    it("disables tap events while a spinner is being shown", async () => {
      const navigator = { push: jest.fn(), pop: jest.fn() }
      useCreateBidderPositionMock.mockReturnValue([mockCreateBidderMutation, true])

      renderWithRelay(
        { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
        { ...initialProps, navigator }
      )

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
        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

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
          renderWithRelay(
            { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
            initialProps
          )

          fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

          console.error = jest.fn() // Silences component logging.
          relay.commitMutation = commitMutationMock((_, { onError }) => {
            onError!(new Error("An error occurred."))
            return { dispose: jest.fn() }
          }) as any

          fireEvent.press(screen.getByTestId("bid-button"))

          expect(useCreateBidderPosition).toHaveBeenCalled()
          expect(bidderPositionQueryMock).not.toHaveBeenCalled()
        })

        it("displays an error message on a network failure", () => {
          const erroredCreateBidderPositionMutation = jest
            .fn()
            .mockImplementation(({ onError }) => {
              onError(new Error("Network request failed"))
            })
          useCreateBidderPositionMock.mockReturnValue([erroredCreateBidderPositionMutation, false])

          renderWithRelay(
            { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
            initialProps
          )

          fireEvent.press(screen.getByTestId("disclaimer-checkbox"))
          console.error = jest.fn() // Silences component logging.

          fireEvent.press(screen.getByTestId("bid-button"))

          expect(nextStep?.component).toEqual(BidResult)
          expect(nextStep?.passProps).toEqual(
            expect.objectContaining({
              bidderPositionResult: {
                messageHeader: "An error occurred",
                messageDescriptionMD:
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

          const erroredCreateBidderPositionMutation = jest
            .fn()
            .mockImplementation(({ onCompleted }) => {
              onCompleted({}, [error])
            })
          useCreateBidderPositionMock.mockReturnValue([erroredCreateBidderPositionMutation, false])

          renderWithRelay(
            { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
            initialProps
          )

          fireEvent.press(screen.getByTestId("disclaimer-checkbox"))
          fireEvent.press(screen.getByTestId("bid-button"))

          await waitFor(() => !!nextStep)

          expect(nextStep?.component).toEqual(BidResult)
          expect(nextStep?.passProps).toEqual(
            expect.objectContaining({
              bidderPositionResult: {
                messageHeader: "An error occurred",
                messageDescriptionMD:
                  "Your bid couldn’t be placed. Please\ncheck your internet connection\nand try again.",
              },
            })
          )
        })
      })
    })
  })

  xdescribe("editing bid amount", () => {
    it("allows you to go to the max bid edit screen and select a new max bid", async () => {
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

      const view = mountConfirmBidComponent({
        ...initialPropsForRegisteredUser,
        navigator: fakeNavigator,
      })

      const selectMaxBidRow = (await view.root.findAllByType(TouchableWithoutFeedback))[0]

      // eslint-disable-next-line testing-library/no-node-access
      expect((await selectMaxBidRow.findAllByType(Text))[1].props.children).toEqual("$45,000")

      selectMaxBidRow.props.onPress()

      const editScreen = await fakeNavigator.nextStep().root.findByType(SelectMaxBid)

      expect(editScreen.props.selectedBidIndex).toEqual(0)

      editScreen.instance.setState({ selectedBidIndex: 1 })
      ;(await editScreen.findByType(Button)).props.onPress()

      const { selectedBidIndex } = fakeNavigator.nextRoute().passProps as any
      expect(selectedBidIndex).toEqual(1)
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

        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

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

        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResult)
        expect(nextStep?.passProps).toEqual(
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

        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValue(
          Promise.resolve(mockRequestResponses.pollingForBid.pending)
        )

        fireEvent.press(screen.getByTestId("bid-button"))
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResult)
        expect(nextStep?.passProps).toEqual(
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

        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
        )

        fireEvent.press(screen.getByTestId("bid-button"))
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResult)
        expect(nextStep?.passProps).toEqual(
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

        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.outbid)
        )

        fireEvent.press(screen.getByTestId("bid-button"))
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResult)
        expect(nextStep?.passProps).toEqual(
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

        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        bidderPositionQueryMock.mockReturnValueOnce(
          Promise.resolve(mockRequestResponses.pollingForBid.reserveNotMet)
        )

        fireEvent.press(screen.getByTestId("bid-button"))
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResult)
        expect(nextStep?.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.pollingForBid.reserveNotMet.me!.bidderPosition,
          })
        )
      })

      it("updates the main auction screen", async () => {
        const navigator = { push: jest.fn() }
        const completedCreateBidderPositionMutation = jest
          .fn()
          .mockImplementation(({ onCompleted }) => {
            onCompleted(mockRequestResponses.placingBid.bidAccepted, null)
          })
        useCreateBidderPositionMock.mockReturnValue([completedCreateBidderPositionMutation, false])

        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          { ...initialProps, navigator }
        )

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
        expect(navigator.push).toHaveBeenCalledWith({
          component: BidResult,
          passProps: expect.objectContaining({
            bidderPositionResult: {
              position: {
                internalID: "bidder-position-id-from-polling",
              },
              status: "RESERVE_NOT_MET",
            },
            sale_artwork: expect.objectContaining({
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
          }),
          title: "",
        })
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

        renderWithRelay(
          { Me: () => ({ hasQualifiedCreditCards: true }), SaleArtwork: () => saleArtwork },
          initialProps
        )

        fireEvent.press(screen.getByTestId("disclaimer-checkbox"))

        fireEvent.press(screen.getByTestId("bid-button"))

        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResult)
        expect(nextStep?.passProps).toEqual(
          expect.objectContaining({
            bidderPositionResult:
              mockRequestResponses.placingBid.bidRejected.createBidderPosition!.result,
          })
        )
      })
    })
  })

  // TODO: Update after adding bidflow state
  describe.skip("ConfirmBid for unqualified user", () => {
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

    it("shows the credit card form when the user tap the edit text in the credit card row", async () => {
      // const view = mountConfirmBidComponent(initialPropsForUnqualifiedUser)
      // const creditcardRow = (await view.root.findAllByType(TouchableWithoutFeedback))[1]
      renderWithRelay(
        {
          Me: () => ({ hasQualifiedCreditCards: false }),
          SaleArtwork: () => saleArtwork,
        },
        initialProps
      )

      fireEvent.press(screen.getByText("Add"))

      expect(nextStep?.component).toEqual(CreditCardForm)
    })

    xit("shows the error screen when stripe's API returns an error", async () => {
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

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(
        screen.queryByText(
          "There was a problem processing your information. Check your payment details and try again."
        )
      ).not.toBeOnTheScreen()
    })

    xit("shows the error screen with the correct error message on a createCreditCard mutation failure", async () => {
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

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(screen.queryByText("Your card's security code is incorrect.")).not.toBeOnTheScreen()
    })

    xit("shows the error screen with the default error message if there are unhandled errors from the createCreditCard mutation", async () => {
      const errors = [{ message: "malformed error" }]

      console.error = jest.fn() // Silences component logging.
      ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
      relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
        onCompleted!({}, errors)
        return { dispose: jest.fn() }
      }) as any

      const view = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

      await fillOutFormAndSubmit(view)

      const modal = await view.root.findByType(Modal)
      const modalText = await modal.findAllByType(Text)
      const modalButton = await modal.findByType(Button)

      // eslint-disable-next-line testing-library/no-node-access
      expect(modalText[1].props.children).toEqual([
        "There was a problem processing your information. Check your payment details and try again.",
      ])
      modalButton.props.onPress()

      // it dismisses the modal
      expect(modal.props.visible).toEqual(false)
    })

    xit("shows the error screen with the default error message if the creditCardMutation error message is empty", async () => {
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

      // press the dismiss modal button
      fireEvent.press(screen.getByText("Ok"))

      // error modal is dismissed
      expect(
        screen.queryByText(
          "There was a problem processing your information. Check your payment details and try again."
        )
      ).not.toBeOnTheScreen()
    })

    xit("shows the generic error screen on a createCreditCard mutation network failure", async () => {
      console.error = jest.fn() // Silences component logging.
      ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
      relay.commitMutation = commitMutationMock((_, { onError }) => {
        onError!(new TypeError("Network request failed"))
        return { dispose: jest.fn() }
      }) as any

      const view = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

      await fillOutFormAndSubmit(view)

      expect(nextStep?.component).toEqual(BidResult)
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

    xdescribe("After successful mutations", () => {
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

        const view = mountConfirmBidComponent(initialPropsForUnqualifiedUser)

        fillOutFormAndSubmit(view)
        await waitFor(() => !!nextStep)

        expect(nextStep?.component).toEqual(BidResult)
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
      // renderWithWrappers(<ConfirmBid {...initialPropsForCascadingSale} />)
      renderWithRelay({ SaleArtwork: () => cascadingEndTimeSaleArtwork }, initialProps)

      expect(screen.getByText("00d 00h 00m 10s")).toBeOnTheScreen()
    })

    it("shows the sale's end time if the sale does not have cascading end times", () => {
      // renderWithWrappers(<ConfirmBid {...initialPropsForNonCascadingSale} />)
      renderWithRelay({ SaleArtwork: () => nonCascadeSaleArtwork }, initialProps)

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

  const saleArtwork: ConfirmBid_saleArtwork$data = {
    ...baseSaleArtwork,
    endAt: null,
    extendedBiddingEndAt: null,
    sale: {
      ...baseSaleArtwork.sale,
      liveStartAt: "2018-05-09T20:22:42+00:00",
      cascadingEndTimeIntervalMinutes: null,
    },
    " $fragmentSpreads": null as any, // needs this to keep TS happy
    " $fragmentType": null as any, // needs this to keep TS happy
  }

  const nonCascadeSaleArtwork: ConfirmBid_saleArtwork$data = {
    ...baseSaleArtwork,
    endAt: null,
    extendedBiddingEndAt: null,
    sale: {
      ...baseSaleArtwork.sale,
      endAt: new Date(Date.now() + 10000).toISOString(),
      liveStartAt: null,
      cascadingEndTimeIntervalMinutes: null,
    },
    " $fragmentSpreads": null as any, // needs this to keep TS happy
    " $fragmentType": null as any, // needs this to keep TS happy
  }

  const cascadingEndTimeSaleArtwork: ConfirmBid_saleArtwork$data = {
    ...saleArtwork,
    endAt: "2018-05-13T20:22:42+00:00",
    extendedBiddingEndAt: new Date(Date.now() + 10000).toISOString(),
    sale: {
      ...baseSaleArtwork.sale,
      liveStartAt: null,
      cascadingEndTimeIntervalMinutes: 1,
    },
  }

  const saleArtworkRegisteredForBidding: ConfirmBid_saleArtwork$data = {
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

  const initialProps: ConfirmBidProps = {
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
    sale_artwork: saleArtworkRegisteredForBidding,
  } as any
})
