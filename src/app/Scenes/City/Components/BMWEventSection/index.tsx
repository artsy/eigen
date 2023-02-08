import { CaretButton } from "app/Components/Buttons/CaretButton"
import { Event } from "app/Scenes/City/Components/Event"
import { Show } from "app/Scenes/Map/types"
import { navigate } from "app/system/navigation/navigate"
import { Schema, Track, track as _track } from "app/utils/track"
import { Box, ClassTheme, Text } from "palette"
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
              <Text variant="lg-display">{title}</Text>
            </Box>
            <Box mb={2} px={2}>
              <Text variant="sm" weight="medium">
                Presented by BMW
              </Text>
              <Box mt={1}>
                <Text variant="sm" color={color("black60")}>
                  {introText}
                </Text>
              </Box>
            </Box>
            <Box mb={4} px={2}>
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
