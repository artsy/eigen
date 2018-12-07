import { Box, Separator, Theme } from "@artsy/palette"
import { FairDetail_fair } from "__generated__/FairDetail_fair.graphql"
import React from "react"
import { FlatList, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import { HoursCollapsible } from "lib/Components/HoursCollapsible"
import { LocationMapContainer as LocationMap, PartnerType } from "lib/Components/LocationMap"
import { ArtworksPreviewContainer as ArtworksPreview } from "../Components/ArtworksPreview"
import { FairHeaderContainer as FairHeader } from "../Components/FairHeader"
import { SearchLink } from "../Components/SearchLink"

interface Props extends ViewProperties {
  fair: FairDetail_fair
  onViewAllArtworksPressed: () => void
}

interface State {
  sections: Array<{
    type: "hours" | "location"
    data: any
  }>
  extraData?: { animatedValue: { height: number } }
}

export class FairDetail extends React.Component<Props, State> {
  state: State = {
    sections: [],
  }

  componentDidMount() {
    const { fair } = this.props
    const sections = []

    sections.push({
      type: "location",
      data: {
        location: fair.location,
        partnerName: fair.organizer.profile.name,
        partnerType: PartnerType.fair,
      },
    })

    sections.push({
      type: "hours",
      data: {
        hours: fair.hours,
      },
    })

    sections.push({
      type: "search",
      data: {
        fairID: fair.id,
      },
    })

    sections.push({
      type: "artworks",
      data: {
        fair,
      },
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

  renderItem = ({ item: { data, type } }) => {
    switch (type) {
      case "location":
        return <LocationMap partnerType="Fair" {...data} />
      case "hours":
        return <HoursCollapsible {...data} onAnimationFrame={this.handleAnimationFrame} />
      case "search":
        return <SearchLink {...data} />
      case "artworks":
        return <ArtworksPreview {...data} onViewAllArtworksPressed={this.props.onViewAllArtworksPressed} />
      default:
        return null
    }
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

  render() {
    const { fair } = this.props
    const { sections, extraData } = this.state

    return (
      <Theme>
        <FlatList
          ListHeaderComponent={<FairHeader fair={fair} />}
          keyExtractor={(item, index) => item.type + String(index)}
          extraData={extraData}
          data={sections}
          renderItem={item => <Box px={2}>{this.renderItem(item)}</Box>}
          ItemSeparatorComponent={this.renderItemSeparator}
        />
      </Theme>
    )
  }
}

export const FairDetailContainer = createFragmentContainer(
  FairDetail,
  graphql`
    fragment FairDetail_fair on Fair {
      ...FairHeader_fair
      ...ArtworksPreview_fair
      id
      hours
      location {
        ...LocationMap_location
      }

      organizer {
        profile {
          name
        }
      }
    }
  `
)
