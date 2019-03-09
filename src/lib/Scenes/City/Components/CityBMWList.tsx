import { CityBMWList_city } from "__generated__/CityBMWList_city.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  city: CityBMWList_city
}

class CityBMWList extends React.Component<Props> {
  render() {
    return null
  }
}

export default createFragmentContainer(
  CityBMWList,
  graphql`
    fragment CityBMWList_city on City
      @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String", defaultValue: "" }) {
      shows(discoverable: true, first: $count, after: $cursor, sort: START_AT_ASC) {
        edges {
          node {
            id
            _id
            __id
            name
            status
            href
            is_followed
            exhibition_period
            cover_image {
              url
            }
            location {
              coordinates {
                lat
                lng
              }
            }
            type
            start_at
            end_at
            partner {
              ... on Partner {
                name
                type
              }
              ... on ExternalPartner {
                name
              }
            }
          }
        }
      }
    }
  `
)
