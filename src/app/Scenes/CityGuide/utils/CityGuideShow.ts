import { graphql } from "react-relay"

/**
 * Shared "show" row shape for City Guide and Map scenes. Unmask with
 * `useFragment(cityGuideShowFragment, extractNodes(connection))`; carries `...ShowItemRow_show` so `ShowItemRow` consumers always have their fields.
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
    isFreeAdmission
    cover_image: coverImage {
      url
    }
    location {
      cityGuideNeighborhood {
        slug
      }
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
