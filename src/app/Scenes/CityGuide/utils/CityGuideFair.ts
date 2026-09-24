import { graphql } from "react-relay"

/**
 * Shared shape for a "fair" row across the City Guide and Map scenes. Spread on a node, then
 * unmask the array with `useFragment(cityGuideFairFragment, extractNodes(connection))`.
 */
export const cityGuideFairFragment = graphql`
  fragment CityGuideFair_fair on Fair @relay(plural: true) {
    id
    internalID
    slug
    name
    exhibition_period: exhibitionPeriod(format: SHORT)
    counts {
      partners
    }
    location {
      address
      cityGuideNeighborhood {
        slug
      }
      coordinates {
        lat
        lng
      }
    }
    image {
      image_url: imageURL
      aspect_ratio: aspectRatio
      url
    }
    profile {
      icon {
        internalID
        href
        height
        width
        url(version: "square140")
      }
      id
      internalID
      isFollowed
      slug
      name
    }
    start_at: startAt
    end_at: endAt
  }
`
