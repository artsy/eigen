import { graphql } from "react-relay"
import { AuctionResultsScreenWrapper, AuctionResultsState } from "./AuctionResultsScreenWrapper"

export const AuctionResultsForArtistsYouFollowQueryRenderer = () => {
  return <AuctionResultsScreenWrapper state={AuctionResultsState.PAST} />
}

export const AuctionResultsForArtistsYouFollowPrefetchQuery = graphql`
  query AuctionResultsForArtistsYouFollowPrefetchQuery {
    me {
      ...AuctionResultsScreenWrapper_me @arguments(state: PAST)
    }
  }
`
