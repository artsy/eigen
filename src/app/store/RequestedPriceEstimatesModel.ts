import { action, Action } from "easy-peasy"

export interface RequestedPriceEstimate {
  artworkId: string
  requestedAt: number // the date that the request was made
}

export interface RequestedPriceEstimatesModel {
  requestedPriceEstimates: Record<RequestedPriceEstimate["artworkId"], RequestedPriceEstimate>
  addRequestedPriceEstimate: Action<this, RequestedPriceEstimate>
}

export const getRequestedPriceEstimatesModel = (): RequestedPriceEstimatesModel => ({
  requestedPriceEstimates: {},
  addRequestedPriceEstimate: action((state, request) => {
    const { artworkId } = request
    const temp: RequestedPriceEstimatesModel["requestedPriceEstimates"] = {}
    temp[artworkId] = request
    const requests = { ...state.requestedPriceEstimates, ...temp }
    state.requestedPriceEstimates = requests
  }),
})
