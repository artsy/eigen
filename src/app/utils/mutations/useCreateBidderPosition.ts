import { useCreateBidderPositionMutation } from "__generated__/useCreateBidderPositionMutation.graphql"
import { graphql, useMutation } from "react-relay"

export const useCreateBidderPosition = () => {
  return useMutation<useCreateBidderPositionMutation>(graphql`
    mutation useCreateBidderPositionMutation($input: BidderPositionInput!) {
      createBidderPosition(input: $input) {
        result {
          status
          messageHeader
          messageDescriptionMD
          position {
            internalID
            suggestedNextBid {
              cents
              display
            }
            saleArtwork {
              reserveMessage
              currentBid {
                display
              }
              counts {
                bidderPositions
              }
              artwork {
                myLotStanding(live: true) {
                  activeBid {
                    isWinning
                  }
                  mostRecentBid {
                    maxBid {
                      display
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `)
}
