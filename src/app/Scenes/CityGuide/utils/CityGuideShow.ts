import { graphql } from "react-relay"

/**
 * Shared shape for a "show" row across the City guide and Map scenes. Spread `...CityGuideShow_show`
 * on a connection's `node`, then unmask the whole extracted array in one call with
 * `useFragment(cityGuideShowFragment, extractNodes(connection))` (plural, so it accepts an array of refs);
 * also spreads `...ShowItemRow_show` internally so any consumer that renders `ShowItemRow` is guaranteed
 * to have fetched the fields it needs, instead of relying on that data having incidentally already
 * landed in the Relay store from elsewhere.
 */
export const cityGuideShowFragment = graphql`
  fragment CityGuideShow_show on Show @relay(plural: true) {
    ...ShowItemRow_show
    id
    slug
    internalID
    isStubShow
    name
    status
    href
    type
    is_followed: isFollowed
    exhibition_period: exhibitionPeriod(format: SHORT)
    cover_image: coverImage {
      url
    }
    location {
      coordinates {
        lat
        lng
      }
    }
    start_at: startAt
    end_at: endAt
    partner {
      ... on Partner {
        name
        type
        profile {
          image {
            url(version: "square")
          }
        }
      }
    }
  }
`
