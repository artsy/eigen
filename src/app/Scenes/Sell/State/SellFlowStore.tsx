import { Action, action, createContextStore } from "easy-peasy"

export interface SellFlowStoreModel {
  /** The resale submission the seller is working on in steps 2 and 3 */
  activeResaleSubmissionID: string | null
  setActiveResaleSubmissionID: Action<this, string>
}

export const sellFlowStoreModel: SellFlowStoreModel = {
  activeResaleSubmissionID: null,
  setActiveResaleSubmissionID: action((state, resaleSubmissionID) => {
    state.activeResaleSubmissionID = resaleSubmissionID
  }),
}

export const SellFlowStore = createContextStore<SellFlowStoreModel>((injections) => ({
  ...sellFlowStoreModel,
  ...injections,
}))
