import { CaretButton } from "app/Components/Buttons/CaretButton"
import { navigate } from "app/navigation/navigate"
import { Event } from "app/Scenes/City/Components/Event"
import { Show } from "app/Scenes/Map/types"
import { Schema, Track, track as _track } from "app/utils/track"
import { Box, ClassTheme, Sans, Serif } from "palette"
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
    }
    featuredShows: [Show]
  }
}

const track: Track<Props> = _track

@track()
export class BMWEventSection extends React.Component<Props> {
  renderEvents = () => {
    const {
      sponsoredContent: { featuredShows },
      relay,
    } = this.props

    return featuredShows.map((show, i) => {
      return (
        <Box key={i} mb={1}>
          <Event section="bmw" event={show} relay={relay} />
        </Box>
      )
    })
  }

  @track((__, _, args) => {
    const citySlug = args[1]
    return {
      action_name: Schema.ActionNames.GetBMWArtGuide,
      action_type: Schema.ActionTypes.Tap,
      owner_id: Schema.OwnerEntityTypes.CityGuide,
      owner_slug: citySlug,
      owner_type: citySlug,
    } as any
  })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  getArtGuidePressed(artGuideUrl, _citySlug) {
    navigate(artGuideUrl)
  }

  viewAllBmwShows = () => {
    const { citySlug } = this.props
    navigate(`/city-bmw-list/${citySlug}`)
  }

  render() {
    const {
      citySlug,
      sponsoredContent: {
        introText,
        artGuideUrl,
        shows: { totalCount },
      },
      title,
    } = this.props

    return (
      <ClassTheme>
        {({ color }) => (
          <>
            <Box my={2} px={2}>
              <Serif size="8">{title}</Serif>
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
              <CaretButton
                onPress={() => this.getArtGuidePressed(artGuideUrl, citySlug)}
                text="Get the BMW Art Guide"
              />
            </Box>
            {this.renderEvents()}
            {totalCount > 2 && (
              <Box px={2} mb={2}>
                <CaretButton
                  onPress={() => this.viewAllBmwShows()}
                  text={`View all ${totalCount} shows`}
                />
              </Box>
            )}
          </>
        )}
      </ClassTheme>
    )
  }
}
