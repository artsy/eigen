import { graphql } from "react-relay"

/** Shared shape for a "fair" row across the City guide and Map scenes. Spread `...CityGuideFair_fair`
 * on a connection's `node`, then unmask the whole extracted array in one call with
 * `useFragment(cityGuideFairFragment, extractNodes(connection))` (plural, so it accepts an array of refs). */
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
      slug
      name
    }
    start_at: startAt
    end_at: endAt
  }
`
