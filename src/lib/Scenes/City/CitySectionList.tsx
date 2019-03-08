import { CitySectionList_city } from "__generated__/CitySectionList_city.graphql"
import { get } from "lodash"
import React from "react"
import { createPaginationContainer, graphql } from "react-relay"
import { RelayProp } from "react-relay"
import { EventList } from "./Components/EventList"

interface Props {
  city: CitySectionList_city
  citySlug: string
  section: string
}

interface State {
  relay: RelayProp
}

class CitySectionList extends React.Component<Props, State> {
  state = {
    buckets: null,
    relay: null,
  }

  render() {
    const {
      section,
      city: { name, shows },
    } = this.props
    console.log("this.props", this.props)
    return (
      <EventList key={name + section} cityName={name} bucket={shows.edges} type={section} relay={this.state.relay} />
    )
  }
}

export default createPaginationContainer(
  CitySectionList,
  {
    city: graphql`
      fragment CitySectionList_city on City
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        name
        shows(discoverable: true, first: $count, sort: START_AT_ASC, after: $cursor)
          @connection(key: "CitySectionList_shows") {
          edges {
            node {
              id
              _id
              __id
              is_followed
              start_at
              end_at
              status
              href
              type
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
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return get(props, "props.city.shows")
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        citySlug: props.citySlug,
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query CitySectionListQuery($count: Int!, $cursor: String, $citySlug: String!) {
        city(slug: $citySlug) {
          ...CitySectionList_city @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
