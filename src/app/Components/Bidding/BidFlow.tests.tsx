import { createToken } from "@stripe/stripe-react-native"
import { act, fireEvent, screen } from "@testing-library/react-native"
import { BidderPositionQuery$data } from "__generated__/BidderPositionQuery.graphql"
import {
  BidFlowContextProvider,
  BidFlowContextStore,
} from "app/Components/Bidding/Context/BidFlowContextProvider"
import { bidderPositionQuery } from "app/Components/Bidding/Screens/ConfirmBid/BidderPositionQuery"
import { BiddingNavigator } from "app/Navigation/AuthenticatedRoutes/BiddingNavigator"
import { useCreateBidderPosition } from "app/utils/mutations/useCreateBidderPosition"
import { useCreateCreditCard } from "app/utils/mutations/useCreateCreditCard"
import { useUpdateUserPhoneNumber } from "app/utils/mutations/useUpdateUserPhoneNumber"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import "react-native"
import { graphql } from "react-relay"

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

describe("BidFlow", () => {
  const bidderPositionQueryMock = bidderPositionQuery as jest.Mock<any>
  const useUpdateUserPhoneNumberMock = useUpdateUserPhoneNumber as jest.Mock
  const useCreateCreditCardMock = useCreateCreditCard as jest.Mock<any>
  const useCreateBidderPositionMock = useCreateBidderPosition as jest.Mock<any>

  let mockStore: ReturnType<typeof BidFlowContextStore.useStore>

  const MockStoreInstance = () => {
    mockStore = BidFlowContextStore.useStore()
    return null
  }

  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => {
      return (
        <BidFlowContextProvider>
          <BiddingNavigator
            initialRouteName="SelectMaxBid"
            artworkID="meteor-shower"
            saleID="best-art-sale-in-town"
            {...props}
          />
          <MockStoreInstance />
        </BidFlowContextProvider>
      )
    },
    query: graphql`
      query BidFlowTestsQuery($artworkID: String!, $saleID: String!) {
        artwork(id: $artworkID) {
          saleArtwork(saleID: $saleID) {
            ...SelectMaxBid_saleArtwork
          }
        }
        me {
          ...SelectMaxBid_me
        }
      }
    `,
    variables: { artworkID: "meteor-shower", saleID: "best-art-sale-in-town" },
  })

  beforeEach(() => {
    useUpdateUserPhoneNumberMock.mockReturnValue([jest.fn(), false])
    useCreateCreditCardMock.mockReturnValue([jest.fn(), false])
    useCreateBidderPositionMock.mockReturnValue([jest.fn(), false])
  })

  it("allows bidders with a qualified credit card to bid", async () => {
    const mockCreateBidderPositionMutation = jest.fn().mockImplementation(({ onCompleted }) => {
      onCompleted(mockRequestResponses.placingBid.bidAccepted)
    })

    useCreateBidderPositionMock.mockReturnValue([mockCreateBidderPositionMutation, false])
    renderWithRelay({
      SaleArtwork: () => saleArtwork,
      Me: () => me.qualifiedUser,
    })

    // Select Max Bid
    expect(screen.getByText("$35,000")).toBeOnTheScreen()

    act(() => {
      mockStore.getActions().setSelectedBidIndex(2)
    })

    expect(screen.getByText("$45,000")).toBeOnTheScreen()
    fireEvent.press(screen.getByText("Next"))

    // Confirm Bid
    expect(screen.getByText("Confirm your bid")).toBeOnTheScreen()
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    bidderPositionQueryMock.mockReturnValueOnce(
      Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
    )

    expect(
      screen.getByText(/I agree to Artsy's General Terms and Conditions of Sale/)
    ).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId("disclaimer-checkbox"))
    fireEvent.press(screen.getByTestId("bid-button"))

    // Bid Result
    await screen.findByText("You’re the highest bidder")
  })

  it("allows bidders without a qualified credit card to register a card and bid", async () => {
    const mockUpdateUserPhoneNumberMutation = jest.fn().mockImplementation(({ onCompleted }) => {
      onCompleted(mockRequestResponses.updateMyUserProfile)
    })
    const mockCreateCreditCardMutation = jest.fn().mockImplementation(({ onCompleted }) => {
      onCompleted(mockRequestResponses.creatingCreditCardSuccess)
    })
    const mockCreateBidderPositionMutation = jest.fn().mockImplementation(({ onCompleted }) => {
      onCompleted(mockRequestResponses.placingBid.bidAccepted)
    })

    useUpdateUserPhoneNumberMock.mockReturnValue([mockUpdateUserPhoneNumberMutation, false])
    useCreateCreditCardMock.mockReturnValue([mockCreateCreditCardMutation, false])
    useCreateBidderPositionMock.mockReturnValue([mockCreateBidderPositionMutation, false])

    renderWithRelay({
      SaleArtwork: () => saleArtwork,
      Me: () => me.unqualifiedUser,
    })

    // Select Max Bid
    expect(screen.getByText("$35,000")).toBeOnTheScreen()
    act(() => {
      mockStore.getActions().setSelectedBidIndex(2)
    })
    expect(screen.getByText("$45,000")).toBeOnTheScreen()
    fireEvent.press(screen.getByText("Next"))

    // Confirm Bid
    expect(screen.getByText("Confirm your bid")).toBeOnTheScreen()
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    bidderPositionQueryMock.mockReturnValueOnce(
      Promise.resolve(mockRequestResponses.pollingForBid.highestBidder)
    )

    // mimic adding a credit card
    act(() => {
      mockStore.getActions().setBillingAddress(billingAddress)
      mockStore.getActions().setCreditCardToken(stripeToken as any)
    })

    expect(
      screen.getByText(/I agree to Artsy's General Terms and Conditions of Sale/)
    ).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId("disclaimer-checkbox"))
    fireEvent.press(screen.getByTestId("bid-button"))

    // Bid Result
    await screen.findByText("You’re the highest bidder")
  })
})

const stripeToken = {
  id: "token-id",
  created: 1528817746,
  livemode: 10,
  card: {
    brand: "VISA",
    last4: "4242",
  },
}

const billingAddress = {
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

const me = {
  qualifiedUser: {
    hasQualifiedCreditCards: true,
  },
  unqualifiedUser: {
    hasQualifiedCreditCards: false,
  },
}

const saleArtwork = {
  internalID: "sale-artwork-id",
  artwork: {
    id: "meteor shower",
    title: "Meteor Shower",
    date: "2015",
    artistNames: "Makiko Kudo",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/5RvuM9YF68AyD8OgcdLw7g/small.jpg",
    },
  },
  sale: {
    id: "best-art-sale-in-town",
    bidder: null,
  },
  lotLabel: "538",
  increments: [
    {
      display: "$35,000",
      cents: 3500000,
    },
    {
      display: "$40,000",
      cents: 4000000,
    },
    {
      display: "$45,000",
      cents: 4500000,
    },
  ],
}

const mockRequestResponses = {
  updateMyUserProfile: {},
  creatingCreditCardSuccess: {
    createCreditCard: {
      creditCardOrError: {
        creditCard: {
          id: "new-credit-card",
        },
      },
    },
  },
  placingBid: {
    bidAccepted: {
      createBidderPosition: {
        result: {
          status: "SUCCESS",
          position: { id: "some-bidder-position-id" },
        },
      },
    },
  },
  pollingForBid: {
    highestBidder: {
      me: {
        bidderPosition: {
          status: "WINNING",
          position: {},
        },
      },
    } as BidderPositionQuery$data,
  },
}
