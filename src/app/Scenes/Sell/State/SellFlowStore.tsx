import { ResaleSubmissionWithChannel } from "app/Scenes/Sell/utils/resaleSubmission"
import { Action, action, createContextStore } from "easy-peasy"

/** The work the seller is taking through steps 2 and 3 */
export interface ActiveSellWork {
  artworkID: string
  resaleSubmission: ResaleSubmissionWithChannel
}

export interface SellFlowStoreModel {
  activeWork: ActiveSellWork | null
  setActiveWork: Action<this, ActiveSellWork>
}

export const sellFlowStoreModel: SellFlowStoreModel = {
  activeWork: null,
  setActiveWork: action((state, work) => {
    state.activeWork = work
  }),
}

export const SellFlowStore = createContextStore<SellFlowStoreModel>((injections) => ({
  ...sellFlowStoreModel,
  ...injections,
}))
