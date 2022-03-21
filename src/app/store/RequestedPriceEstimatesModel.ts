import { action, Action } from "easy-peasy"

export interface RequestedPriceEstimate {
  artworkId: string
  requestedAt: number // the date that the request was made
}

export interface RequestedPriceEstimatesModel {
  requests: Record<RequestedPriceEstimate["artworkId"], RequestedPriceEstimate> | {}
  addRequest: Action<this, RequestedPriceEstimate>
}

export const getRequestedPriceEstimatesModel = (): RequestedPriceEstimatesModel => ({
  requests: {},
  addRequest: action((state, request) => {
    const { artworkId } = request
    state.requests[artworkId] = request
  }),
})
