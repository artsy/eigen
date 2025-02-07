import { Token } from "@stripe/stripe-react-native"
import { SelectMaxBid_saleArtwork$data } from "__generated__/SelectMaxBid_saleArtwork.graphql"
import { Address, PaymentCardTextFieldParams } from "app/Components/Bidding/types"
import { action, Action, Computed, computed, createContextStore } from "easy-peasy"

type Increments = NonNullable<NonNullable<SelectMaxBid_saleArtwork$data["increments"]>[number]>[]

export interface BidFlowContextModel {
  saleArtworkIncrements: Increments
  selectedBidIndex: number
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: Token.Result
  biddingEndAt?: string | null
  selectedBid: Computed<this, Increments[number]>
  setSaleArtworkIncrements: Action<this, Increments>
  setSelectedBidIndex: Action<this, number>
  setBillingAddress: Action<this, Address>
  setCreditCardToken: Action<this, Token.Result>
  setBiddingEndAt: Action<this, string | undefined | null>
}

export const getBidFlowContextStore = (): BidFlowContextModel => ({
  saleArtworkIncrements: [],
  selectedBidIndex: 0,
  billingAddress: undefined,
  creditCardToken: undefined,
  biddingEndAt: null,
  selectedBid: computed((state) => state.saleArtworkIncrements[state.selectedBidIndex]),
  setSaleArtworkIncrements: action((state, payload) => {
    state.saleArtworkIncrements = payload
  }),
  setSelectedBidIndex: action((state, payload) => {
    state.selectedBidIndex = payload
  }),
  setBillingAddress: action((state, payload) => {
    state.billingAddress = payload
  }),
  setCreditCardToken: action((state, payload) => {
    state.creditCardToken = payload
  }),
  setBiddingEndAt: action((state, payload) => {
    state.biddingEndAt = payload
  }),
})

export const BidFlowContextStore = createContextStore((runtimeModel) => ({
  ...getBidFlowContextStore(),
  ...runtimeModel,
}))

export const BidFlowContextProvider = BidFlowContextStore.Provider
