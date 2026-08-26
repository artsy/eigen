import {
  TrendingSearchPeriod,
  useTrendingSearchesQuery,
} from "__generated__/useTrendingSearchesQuery.graphql"
import { graphql, useLazyLoadQuery } from "react-relay"

export const trendingSearchesQuery = graphql`
  query useTrendingSearchesQuery($period: TrendingSearchPeriod!) @cacheable {
    viewer {
      searchDropdown {
        trending(period: $period) {
          artists(first: 7) {
            artist {
              internalID
              slug
              name
              href
              coverArtwork {
                image {
                  url(version: "larger")
                  blurhash
                }
              }
            }
          }
          artworks(first: 10) {
            artwork {
              internalID
              slug
              href
              ...ArtworkRail_artworks
            }
          }
        }
      }
    }
  }
`

export type TrendingPeriod = TrendingSearchPeriod

export const useTrendingSearches = (period: TrendingPeriod, retryCount = 0) => {
  // `fetchKey` bumps allocate a fresh QueryResource cache slot on retry, sidestepping
  // any error entry cached from a previous failed fetch for the same variables.
  const data = useLazyLoadQuery<useTrendingSearchesQuery>(
    trendingSearchesQuery,
    { period },
    { fetchPolicy: "store-or-network", fetchKey: retryCount }
  )

  const trending = data.viewer?.searchDropdown.trending

  const artists = trending?.artists?.flatMap((entry) => (entry.artist ? [entry.artist] : [])) ?? []
  const artworks =
    trending?.artworks?.flatMap((entry) => (entry.artwork ? [entry.artwork] : [])) ?? []

  return { artists, artworks }
}

export type TrendingArtist = ReturnType<typeof useTrendingSearches>["artists"][number]
