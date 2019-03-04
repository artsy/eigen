import { CitySectionList_city } from "__generated__/CitySectionList_city.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { RelayProp } from "react-relay"
import { CitySectionBucketResults } from "../Map/Bucket"
import { EventList } from "./Components/EventList"

interface Props {
  city: CitySectionList_city
  section: string
}

interface State {
  buckets: CitySectionBucketResults
  relay: RelayProp
}

class CitySectionList extends React.Component<Props, State> {
  state = {
    buckets: null,
    relay: null,
  }

  componentWillMount() {
    this.setState({
      buckets: buckets as CitySectionBucketResults,
    })
  }

  render() {
    const {
      section,
      city: { name },
    } = this.props
    const { buckets } = this.state
    console.log("this.props", this.props)
    return <EventList key={name + section} bucket={buckets[section]} type={section} relay={this.state.relay} />
  }
}

export default createFragmentContainer(
  CitySectionList,
  graphql`
    fragment CitySectionList_city on City {
      name
      shows(discoverable: true, first: 50, sort: START_AT_ASC) {
        edges {
          node {
            id
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
  `
)
