import { graphql } from "react-relay"
import {
  AuctionResultsScreenScreenWrapperQueryQueryRenderer,
  AuctionResultsState,
} from "./AuctionResultsScreenWrapper"

export const AuctionResultsUpcomingQueryRenderer = () => {
  return (
    <AuctionResultsScreenScreenWrapperQueryQueryRenderer state={AuctionResultsState.UPCOMING} />
  )
}

export const AuctionResultsUpcomingPrefetchQuery = graphql`
  query AuctionResultsUpcomingPrefetchQuery {
    me {
      ...AuctionResultsScreenWrapper_me @arguments(state: UPCOMING)
    }
  }
`
