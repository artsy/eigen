import { action, Action } from "easy-peasy"
import { assignDeep } from "./persistence"

interface Campaign {
  utm_campaign: string | null
  utm_medium: string | null
  utm_source: string | null
}

export interface ConsignmentsModel {
  // State
  campaign: Campaign

  // Actions
  setCampaign: Action<ConsignmentsModel, Campaign>
}

export const getConsignmentsModel = (): ConsignmentsModel => ({
  campaign: {
    utm_campaign: null,
    utm_medium: null,
    utm_source: null,
  },
  setCampaign: action((state, payload) => {
    assignDeep(state.campaign, payload)
  }),
})
