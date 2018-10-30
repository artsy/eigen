import { Theme } from "@artsy/palette"
import { Show_show } from "__generated__/Show_show.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Artists } from "./Components/Artists"
import { Artworks } from "./Components/Artworks"
import { Location } from "./Components/Location"
import ShowHeader from "./Components/ShowHeader"
import { Shows } from "./Components/Shows"

interface Props extends ViewProperties {
  show: Show_show
}

interface State {
  sections: Array<{
    type: "location" | "artworks" | "artists" | "shows"
    data: any
  }>
}

export class Show extends React.Component<Props, State> {
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

  handleSaveShow = () => {
    /* TODO: implement */
    return Promise.resolve()
  }

  handleMoreInformationPressed = () => {
    /* TODO: implement */
  }

  render() {
    const { show } = this.props
    return (
      <Theme>
        <FlatList
          data={this.state.sections}
          ListHeaderComponent={
            <ShowHeader
              show={show}
              onSaveShowPressed={this.handleSaveShow}
              onMoreInformationPressed={this.handleMoreInformationPressed}
            />
          }
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
      </Theme>
    )
  }
}

export default createFragmentContainer(
  Show,
  graphql`
    fragment Show_show on Show {
      ...ShowHeader_show
      id
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
      counts {
        artworks
        eligible_artworks
      }
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
