import { ArtistShows_artist } from "__generated__/ArtistShows_artist.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { Stack } from "lib/Components/Stack"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { extractNodes } from "lib/utils/extractNodes"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import SmallList from "./SmallList"
import VariableSizeShowsList from "./VariableSizeShowsList"

interface Props {
  artist: ArtistShows_artist
}

const Shows: React.FC<Props> = ({ artist }) => {
  const currentShows = extractNodes(artist.currentShows)
  const upcomingShows = extractNodes(artist.upcomingShows)
  const currentAndUpcomingShows = [...currentShows, ...upcomingShows]

  const pastLargeShows = extractNodes(artist.pastLargeShows)
  const pastSmallShows = extractNodes(artist.pastSmallShows)
  const pastShows = pastLargeShows.length ? pastLargeShows : pastSmallShows

  const pastShowsList = () => {
    // TODO: Use `relay.getVariables().isPad` when this gets merged: https://github.com/facebook/relay/pull/1868
    if (artist.pastLargeShows) {
      return <VariableSizeShowsList showSize={"medium"} shows={extractNodes(artist.pastLargeShows)} />
    } else {
      return <SmallList shows={extractNodes(artist.pastSmallShows)} style={{ marginTop: -8, marginBottom: 50 }} />
    }
  }
  return (
    <StickyTabPageScrollView>
      <Stack spacing={3} py="2">
        {!!currentAndUpcomingShows.length && (
          <View>
            <SectionTitle title="Current & Upcoming Shows" />
            <VariableSizeShowsList showSize="large" shows={currentAndUpcomingShows} />
          </View>
        )}
        {!!pastShows.length && (
          <View>
            <SectionTitle title="Past Shows" />
            {pastShowsList()}
          </View>
        )}
      </Stack>
    </StickyTabPageScrollView>
  )
}

export default createFragmentContainer(Shows, {
  artist: graphql`
    fragment ArtistShows_artist on Artist {
      currentShows: showsConnection(status: "running", first: 10) {
        edges {
          node {
            ...VariableSizeShowsList_shows
          }
        }
      }
      upcomingShows: showsConnection(status: "upcoming", first: 10) {
        edges {
          node {
            ...VariableSizeShowsList_shows
          }
        }
      }
      pastSmallShows: showsConnection(status: "closed", first: 20) @skip(if: $isPad) {
        edges {
          node {
            ...SmallList_shows
          }
        }
      }
      pastLargeShows: showsConnection(status: "closed", first: 20) @include(if: $isPad) {
        edges {
          node {
            ...VariableSizeShowsList_shows
          }
        }
      }
    }
  `,
})
