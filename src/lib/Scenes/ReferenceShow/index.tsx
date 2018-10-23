import { ReferenceShow_show } from "__generated__/ReferenceShow_show.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Artists } from "./Components/Artists"
import { Artworks } from "./Components/Artworks"
import { Header } from "./Components/Header"
import { Location } from "./Components/Location"
import { Shows } from "./Components/Shows"

interface Props extends ViewProperties {
  show: ReferenceShow_show
}

interface State {
  sections: Array<{
    type: "location" | "artworks" | "artists" | "shows"
    data: any
  }>
}

export class ReferenceShow extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { show } = this.props
    const sections = []

    sections.push({
      type: "location",
      data: show.location,
    })

    sections.push({
      type: "artworks",
      data: show.artworks,
    })

    sections.push({
      type: "artists",
      data: show.artists,
    })

    // TODO: Add shows data
    sections.push({
      type: "shows",
      data: [{ __id: "foo" }],
    })

    this.setState({ sections })
  }

  render() {
    return (
      <FlatList
        data={this.state.sections}
        ListHeaderComponent={<Header />}
        renderItem={({ item: { data, type } }) => {
          switch (type) {
            case "map":
              return <Location location={data} />
            case "artworks":
              return <Artworks artworks={data} />
            case "artists":
              return <Artists artists={data} />
            case "shows":
              return <Shows shows={data} />
            default:
              return null
          }
        }}
        keyExtractor={(item, index) => item.type + String(index)}
      />
    )
  }
}

export default createFragmentContainer(
  ReferenceShow,
  graphql`
    fragment ReferenceShow_show on Show {
      id
      name
      description
      press_release
      location {
        __id
        id
        city
        address
        address_2
        coordinates {
          lat
          lng
        }
        day_schedules {
          start_time
          end_time
          day_of_week
        }
      }
      artists {
        __id
        id
        name
        is_followed
      }
      artworks {
        __id
        id
        artist_names
        image {
          id
          url
        }
        price
        availability
        contact_label
      }
      status
      counts {
        artworks
        eligible_artworks
      }
      exhibition_period
      description
      partner {
        ... on ExternalPartner {
          name
        }
        ... on Partner {
          name
        }
      }
    }
  `
)
