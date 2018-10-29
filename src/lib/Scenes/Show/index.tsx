import { Show_show } from "__generated__/Show_show.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Artists } from "./Components/Artists"
import { Artworks } from "./Components/Artworks"
import { Header } from "./Components/Header"
import { LocationContainer as Location } from "./Components/Location"
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
      data: show,
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
            case "location":
              return <Location show={data} />
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
  Show,
  graphql`
    fragment Show_show on Show {
      id
      name
      description
      press_release
      ...Location_show
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
    }
  `
)
