import { Sans } from "@artsy/palette"
import { Shows_show } from "__generated__/Shows_show.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowDetails } from "./Components/ShowDetails"

interface Props {
  show: Shows_show
}
export class Shows extends React.Component<Props> {
  render() {
    if (!this.props.show) {
      return null
    }
    const { city, nearbyShows } = this.props.show
    const nearbyShowsDetail = (nearbyShows.edges || []).filter(show => show.node)
    return (
      <>
        <Sans size="8">{"Current Shows In " + city}</Sans>
        <ShowDetails data={nearbyShowsDetail as any} />
      </>
    )
  }
}

export const LocationContainer = createFragmentContainer(
  Shows,
  graphql`
    fragment Shows_show on Show {
      city
      nearbyShows(first: 20) {
        edges {
          node {
            id
            name
            images {
              url
              aspect_ratio
            }
            partner {
              ... on ExternalPartner {
                name
              }
              ... on Partner {
                name
              }
            }
            location {
              address
              address_2
              state
              postal_code
            }
          }
        }
      }
    }
  `
)
