import { BidderPositionQuery } from "__generated__/BidderPositionQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { fetchQuery, graphql } from "react-relay"

export const bidderPositionQuery = (bidderPositionID: string) => {
  return fetchQuery<BidderPositionQuery>(
    getRelayEnvironment(),
    graphql`
      query BidderPositionQuery($bidderPositionID: String!) {
        me {
          bidderPosition(id: $bidderPositionID) {
            status
            messageHeader
            messageDescriptionMD
            position {
              internalID
              suggestedNextBid {
                cents
                display
              }
            }
          }
        }
      }
    `,
    { bidderPositionID },
    { fetchPolicy: "network-only" }
  ).toPromise()
}
