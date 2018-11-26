import { Box, Separator } from "@artsy/palette"
import { Detail_show } from "__generated__/Detail_show.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { LocationMapContainer as LocationMap } from "lib/Components/LocationMap"
import { ArtistsContainer as Artists } from "../Components/Artists"
import { ArtworksContainer as Artworks } from "../Components/Artworks"
import { ShowHeaderContainer as ShowHeader } from "../Components/ShowHeader"
import { ShowsContainer as Shows } from "../Components/Shows"

interface Props extends ViewProperties {
  show: Detail_show
  onMoreInformationPressed: () => void
}

interface State {
  sections: Array<{
    type: "location" | "artworks" | "artists" | "shows"
    data: any
  }>
}

export class Detail extends React.Component<Props, State> {
  state = {
    sections: [],
  }

  componentDidMount() {
    const { show } = this.props
    const sections = []

    sections.push({
      type: "location",
      data: {
        location: show.location,
        partnerName: show.partner.name,
        partnerType: show.partner.type,
      },
    })

    sections.push({
      type: "artworks",
      data: show,
    })

    sections.push({
      type: "artists",
      data: show,
    })

    sections.push({
      type: "shows",
      data: show,
    })

    this.setState({ sections })
  }

  renderItemSeparator = () => (
    <Box py={2} px={2}>
      <Separator />
    </Box>
  )

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "location":
        return <LocationMap {...data} />
      case "artworks":
        return <Artworks show={data} />
      case "artists":
        return <Artists show={data} />
      case "shows":
        return <Shows show={data} />
      default:
        return null
    }
  }

  handleSaveShow = () => {
    /* TODO: implement */
    return Promise.resolve()
  }

  render() {
    const { show, onMoreInformationPressed } = this.props
    return (
      <FlatList
        data={this.state.sections}
        ListHeaderComponent={
          <>
            <ShowHeader
              show={show}
              onSaveShowPressed={this.handleSaveShow}
              onMoreInformationPressed={onMoreInformationPressed}
            />
          </>
        }
        ItemSeparatorComponent={this.renderItemSeparator}
        renderItem={item => <Box px={2}>{this.renderItem(item)}</Box>}
        keyExtractor={(item, index) => item.type + String(index)}
      />
    )
  }
}

export const DetailContainer = createFragmentContainer(
  Detail,
  graphql`
    fragment Detail_show on Show {
      id
      name
      description
      city
      location {
        id
        address
        address_2
        city
        state
        postal_code
      }
      images {
        id
      }
      ...ShowHeader_show
      ...Artworks_show
      ...Artists_show
      ...Shows_show
      location {
        ...LocationMap_location
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
          type
        }
      }
    }
  `
)
