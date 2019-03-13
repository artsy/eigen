import { Box, color, Sans, Serif } from "@artsy/palette"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Event } from "lib/Scenes/City/Components/Event"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { RelayProp } from "react-relay"

export interface Props {
  title: string
  relay: RelayProp
  citySlug: string
  sponsoredContent: {
    introText: string
    artGuideUrl: string
    shows: {
      totalCount: number
      edges: any[]
    }
  }
}

const track: Track<Props> = _track

@track()
export class BMWEventSection extends React.Component<Props> {
  renderEvents = () => {
    const {
      sponsoredContent: {
        shows: { edges },
      },
      relay,
    } = this.props
    return edges.map((edge, i) => {
      if (i < 2) {
        return (
          <Box key={i} mb={1}>
            <Event section="bmw" event={edge.node} relay={relay} />
          </Box>
        )
      }
    })
  }

  @track((__, _, args) => {
    const citySlug = args[1]
    return {
      action_name: Schema.ActionNames.GetBMWArtGuide,
      action_type: Schema.ActionTypes.Tap,
      owner_id: "CityGuide",
      owner_slug: citySlug,
      owner_type: citySlug,
    } as any
  })
  getArtGuidePressed(artGuideUrl, _citySlug) {
    SwitchBoard.presentNavigationViewController(this, artGuideUrl)
  }

  viewAllBmwShows = () => {
    const { citySlug } = this.props
    SwitchBoard.presentNavigationViewController(this, `/city-bmw-list/${citySlug}`)
  }

  render() {
    const {
      citySlug,
      sponsoredContent: {
        introText,
        artGuideUrl,
        shows: { totalCount },
      },
    } = this.props
    return (
      <>
        <Box my={2} px={2}>
          <Serif size="8">{this.props.title}</Serif>
        </Box>
        <Box mb={2} px={2}>
          <Sans weight="medium" size="3">
            Presented by BMW
          </Sans>
          <Box mt={1}>
            <Serif size="3" color={color("black60")}>
              {introText}
            </Serif>
          </Box>
        </Box>
        <Box mb={3} px={2}>
          <CaretButton onPress={() => this.getArtGuidePressed(artGuideUrl, citySlug)} text="Get the BMW Art Guide" />
        </Box>
        {this.renderEvents()}
        {totalCount > 2 && (
          <Box px={2} mb={2}>
            <Sans weight="medium" size="3">
              <CaretButton onPress={() => this.viewAllBmwShows()} text={`View all ${totalCount} shows`} />
            </Sans>
          </Box>
        )}
      </>
    )
  }
}
