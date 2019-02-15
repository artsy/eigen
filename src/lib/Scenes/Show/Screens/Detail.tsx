import { Box, Separator, Serif } from "@artsy/palette"
import { Detail_show } from "__generated__/Detail_show.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { HoursCollapsible } from "lib/Components/HoursCollapsible"
import { LocationMapContainer as LocationMap } from "lib/Components/LocationMap"
import { ShowArtistsPreviewContainer as ShowArtistsPreview } from "lib/Components/Show/ShowArtistsPreview"
import { ShowArtworksPreviewContainer as ShowArtworksPreview } from "lib/Components/Show/ShowArtworksPreview"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowHeaderContainer as ShowHeader } from "../Components/ShowHeader"
import { ShowsContainer as Shows } from "../Components/Shows"

interface Props {
  show: Detail_show
  onMoreInformationPressed: () => void
  onViewAllArtistsPressed: () => void
  onViewAllArtworksPressed: () => void
  onViewMoreInfoPressed: () => void
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
    const { show, onMoreInformationPressed, onViewAllArtworksPressed, onViewAllArtistsPressed } = this.props
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
    }

    if (show.description) {
      sections.push({
        type: "description",
        data: {
          description: show.description,
        },
      })
    }

    sections.push({
      type: "information",
      data: {
        onViewMoreInfoPressed: () => onMoreInformationPressed(),
      },
    })

    if (show.location && show.location.displayDaySchedules) {
      sections.push({
        type: "hours",
        data: {
          hours: show.location.displayDaySchedules,
        },
      })
    }

    if (show.counts && show.counts.artworks) {
      sections.push({
        type: "artworks",
        data: {
          show,
          onViewAllArtworksPressed,
        },
      })
    }

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
    if (item && (item.leadingItem.type === "location" || item.leadingItem.type === "description")) {
      return null
    }
    return (
      <Box pb={2} px={2}>
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
      case "description":
        return <Serif size="3t">{data.description}</Serif>
      case "artworks":
        return <ShowArtworksPreview title="Works" {...data} />
      case "artists":
        return <ShowArtistsPreview {...data} />
      case "shows":
        return <Shows show={data} />
      case "information":
        return <CaretButton onPress={() => data.onViewMoreInfoPressed()} text="View more information" />
      case "hours":
        return <HoursCollapsible {...data} onAnimationFrame={this.handleAnimationFrame} />
      default:
        return null
    }
  }

  render() {
    const { show, onViewAllArtistsPressed } = this.props
    const { extraData, sections } = this.state
    return (
      <FlatList
        data={sections}
        extraData={extraData}
        ListHeaderComponent={<ShowHeader show={show} onViewAllArtistsPressed={onViewAllArtistsPressed} />}
        ItemSeparatorComponent={this.renderItemSeparator}
        renderItem={item => (
          <Box px={2} pb={2}>
            {this.renderItem(item)}
          </Box>
        )}
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
      counts {
        artworks
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
