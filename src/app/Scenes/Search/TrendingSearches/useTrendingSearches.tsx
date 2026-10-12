import { useTrendingSearchesQuery } from "__generated__/useTrendingSearchesQuery.graphql"
import { graphql, useLazyLoadQuery } from "react-relay"

export const trendingSearchesQuery = graphql`
  query useTrendingSearchesQuery @cacheable {
    viewer {
      searchDropdown {
        trending(period: ONE_DAY) {
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

export const useTrendingSearches = () => {
  const data = useLazyLoadQuery<useTrendingSearchesQuery>(
    trendingSearchesQuery,
    {},
    { fetchPolicy: "store-or-network" }
  )

  const trending = data.viewer?.searchDropdown.trending

  const artists = trending?.artists?.flatMap((entry) => (entry.artist ? [entry.artist] : [])) ?? []
  const artworks =
    trending?.artworks?.flatMap((entry) => (entry.artwork ? [entry.artwork] : [])) ?? []

  return { artists, artworks }
}

export type TrendingArtist = ReturnType<typeof useTrendingSearches>["artists"][number]
