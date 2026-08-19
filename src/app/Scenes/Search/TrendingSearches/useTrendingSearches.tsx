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
          label
          artists(first: 7) {
            rank
            artist {
              internalID
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
            rank
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

export const useTrendingSearches = (period: TrendingPeriod) => {
  const data = useLazyLoadQuery<useTrendingSearchesQuery>(
    trendingSearchesQuery,
    { period },
    { fetchPolicy: "store-or-network" }
  )

  const trending = data.viewer?.searchDropdown.trending

  const artists = trending?.artists?.flatMap((entry) => (entry.artist ? [entry.artist] : [])) ?? []
  const artworks =
    trending?.artworks?.flatMap((entry) => (entry.artwork ? [entry.artwork] : [])) ?? []

  return { artists, artworks }
}

export type TrendingArtist = ReturnType<typeof useTrendingSearches>["artists"][number]
