import { Theme } from "@artsy/palette"
import { Show_show } from "__generated__/Show_show.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { Artists } from "./Components/Artists"
import { ArtworksContainer as Artworks } from "./Components/Artworks"
import { LocationContainer as Location } from "./Components/Location"
import { ShowHeaderContainer as ShowHeader } from "./Components/ShowHeader"
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
      data: show,
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
              case "location":
                return <Location show={data} />
              case "artworks":
                return <Artworks show={data} />
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
      id
      name
      description
      press_release

      ...ShowHeader_show
      ...Location_show
      ...Artworks_show

      artists {
        __id
        id
        name
        is_followed
      }
      status
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
