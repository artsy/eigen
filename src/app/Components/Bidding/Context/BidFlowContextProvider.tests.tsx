import {
  BidFlowContextModel,
  getBidFlowContextStore,
} from "app/Components/Bidding/Context/BidFlowContextProvider"
import { createStore } from "easy-peasy"

const createBidFlowStore = (state: any) =>
  createStore<BidFlowContextModel>({ ...getBidFlowContextStore(), ...state })

describe("Bid Flow Context Store", () => {
  it("sets values as expected", () => {
    const bidFlowStates = {
      saleArtworkIncrements: mockIncrements,
      selectedBidIndex: 1,
      billingAddress: mockBillingAddress,
      creditCardToken: mockStripeToken,
      biddingEndAt: "2021-12-31T23:59:59Z",
    }

    const store = createBidFlowStore(bidFlowStates)

    expect(store.getState().saleArtworkIncrements).toEqual(mockIncrements)
    expect(store.getState().selectedBidIndex).toEqual(1)
    expect(store.getState().billingAddress).toEqual(mockBillingAddress)
    expect(store.getState().creditCardToken).toEqual(mockStripeToken)
    expect(store.getState().biddingEndAt).toEqual("2021-12-31T23:59:59Z")
  })

  it("updates values as expected", () => {
    const store = createBidFlowStore({})

    store.getActions().setSaleArtworkIncrements(mockIncrements)
    store.getActions().setSelectedBidIndex(1)
    store.getActions().setBillingAddress(mockBillingAddress)
    store.getActions().setCreditCardToken(mockStripeToken as any)
    store.getActions().setBiddingEndAt("2021-12-31T23:59:59Z")

    expect(store.getState().saleArtworkIncrements).toEqual(mockIncrements)
    expect(store.getState().selectedBidIndex).toEqual(1)
    expect(store.getState().billingAddress).toEqual(mockBillingAddress)
    expect(store.getState().creditCardToken).toEqual(mockStripeToken)
    expect(store.getState().biddingEndAt).toEqual("2021-12-31T23:59:59Z")
  })

  it("gets the correct selectedBid", () => {
    const store = createBidFlowStore({})

    store.getActions().setSaleArtworkIncrements(mockIncrements)
    store.getActions().setSelectedBidIndex(1)

    expect(store.getState().selectedBid).toEqual(mockIncrements[1])

    store.getActions().setSelectedBidIndex(2)

    expect(store.getState().selectedBid).toEqual(mockIncrements[2])
  })
})

const mockBillingAddress = {
  fullName: "John Doe",
  addressLine1: "123 Main St",
  addressLine2: "Apt 1",
  city: "New York",
  state: "NY",
  country: {
    longName: "United States",
    shortName: "US",
  },
  postalCode: "10001",
  phoneNumber: "123-456-7890",
}

const mockStripeToken = {
  id: "fake-token",
  created: "1528229731",
  livemode: 0,
  card: {
    brand: "VISA",
    last4: "4242",
  },
  bankAccount: null,
  extra: null,
}

const mockIncrements = [
  { cents: 100, display: "100" },
  { cents: 200, display: "200" },
  { cents: 300, display: "300" },
]
