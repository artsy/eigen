import { Box, Separator, Spacer } from "@artsy/palette"
import { Detail_show } from "__generated__/Detail_show.graphql"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { HoursCollapsible } from "lib/Components/HoursCollapsible"
import { LocationMapContainer as LocationMap } from "lib/Components/LocationMap"
import { ShowArtistsPreviewContainer as ShowArtistsPreview } from "lib/Components/Show/ShowArtistsPreview"
import { ShowArtworksPreviewContainer as ShowArtworksPreview } from "lib/Components/Show/ShowArtworksPreview"
import { ShowHeaderContainer as ShowHeader } from "../Components/ShowHeader"
import { ShowsContainer as Shows } from "../Components/Shows"

interface Props {
  show: Detail_show
  onMoreInformationPressed: () => void
  onViewAllArtistsPressed: () => void
  onViewAllArtworksPressed: () => void
}

interface State {
  sections: Array<{
    type: "location" | "artworks" | "artists" | "shows"
    data: any
  }>
  extraData?: { animatedValue: { height: number } }
}

export class Detail extends React.Component<Props, State> {
  state: State = {
    sections: [],
  }

  componentDidMount() {
    const { show, onViewAllArtworksPressed, onViewAllArtistsPressed } = this.props
    const sections = []

    if (show.location) {
      sections.push({
        type: "location",
        data: {
          location: show.location,
          partnerName: show.partner.name,
          partnerType: show.partner.type,
        },
      })

      sections.push({
        type: "hours",
        data: {
          hours: show.location.displayDaySchedules,
        },
      })
    }

    sections.push({
      type: "artworks",
      data: {
        show,
        onViewAllArtworksPressed,
      },
    })

    sections.push({
      type: "artists",
      data: {
        show,
        onViewAllArtistsPressed,
        Component: this,
      },
    })

    sections.push({
      type: "shows",
      data: show,
    })

    this.setState({ sections })
  }

  renderItemSeparator = item => {
    if (item && item.leadingItem.type === "location") {
      return null
    }
    return (
      <Box py={2} px={2}>
        <Separator />
      </Box>
    )
  }

  handleAnimationFrame = animatedValue => {
    /**
     * If children change their size on animation (e.g. HoursCollapsible), we need a sentinel value
     * in state in order to trigger a re-render, as FlatList statically sizes child cells.
     */
    this.setState({
      extraData: {
        ...this.state.extraData,
        animatedValue,
      },
    })
  }

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "location":
        return <LocationMap {...data} />
      case "artworks":
        return <ShowArtworksPreview title="Works" {...data} />
      case "artists":
        return <ShowArtistsPreview {...data} />
      case "shows":
        return <Shows show={data} />
      case "hours":
        return (
          <>
            <Spacer mt={2} />
            <HoursCollapsible {...data} onAnimationFrame={this.handleAnimationFrame} />
          </>
        )
      default:
        return null
    }
  }

  render() {
    const { show, onMoreInformationPressed, onViewAllArtistsPressed } = this.props
    const { extraData, sections } = this.state
    return (
      <FlatList
        data={sections}
        extraData={extraData}
        ListHeaderComponent={
          <ShowHeader
            show={show}
            onMoreInformationPressed={onMoreInformationPressed}
            onViewAllArtistsPressed={onViewAllArtistsPressed}
          />
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
        displayDaySchedules {
          days
          hours
        }
      }
      images {
        id
      }
      ...ShowHeader_show
      ...ShowArtworksPreview_show
      ...ShowArtistsPreview_show
      ...Shows_show
      location {
        ...LocationMap_location
      }

      status
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
