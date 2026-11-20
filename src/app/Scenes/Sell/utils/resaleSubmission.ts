import {
  resaleSubmission_resaleSubmission$data,
  resaleSubmission_resaleSubmission$key,
} from "__generated__/resaleSubmission_resaleSubmission.graphql"
import { SUPPORTED_SELL_CHANNELS, SupportedSellChannel } from "app/Scenes/Sell/constants"
import { graphql, readInlineData } from "react-relay"

/** What the flow keeps from a work’s resale submission */
export interface ResaleSubmission {
  internalID: string
  state: resaleSubmission_resaleSubmission$data["state"]
  channel: SupportedSellChannel | null
  /** The recommended price range, like “US$2,800–US$3,600”, or null without both ends */
  estimate: string | null
  /** The status label, like “In progress” or “Submitted” */
  statusMessage: string
}

/** A submission whose channel the app can show */
export type ResaleSubmissionWithChannel = ResaleSubmission & { channel: SupportedSellChannel }

export const hasSupportedChannel = (
  resaleSubmission: ResaleSubmission
): resaleSubmission is ResaleSubmissionWithChannel => resaleSubmission.channel !== null

export const isResaleSubmissionSellable = (
  resaleSubmission: ResaleSubmission | undefined
): resaleSubmission is ResaleSubmissionWithChannel =>
  resaleSubmission?.state === "ACCEPTED" && hasSupportedChannel(resaleSubmission)

const isSupportedSellChannel = (
  channel: string | null | undefined
): channel is SupportedSellChannel =>
  SUPPORTED_SELL_CHANNELS.includes(channel as SupportedSellChannel)

export const toResaleSubmission = (
  key: resaleSubmission_resaleSubmission$key
): ResaleSubmission => {
  const { internalID, state, channel, statusMessage, recommendedPriceMin, recommendedPriceMax } =
    readInlineData(resaleSubmissionFragment, key)
  const min = recommendedPriceMin?.display
  const max = recommendedPriceMax?.display

  return {
    internalID,
    state,
    channel: isSupportedSellChannel(channel) ? channel : null,
    estimate: min && max ? `${min}–${max}` : null,
    statusMessage,
  }
}

const resaleSubmissionFragment = graphql`
  fragment resaleSubmission_resaleSubmission on ResaleSubmission @inline {
    internalID
    state
    channel
    statusMessage
    recommendedPriceMin {
      display
    }
    recommendedPriceMax {
      display
    }
  }
`
