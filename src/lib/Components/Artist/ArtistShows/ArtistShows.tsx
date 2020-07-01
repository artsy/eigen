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

class Shows extends React.Component<Props> {
  render() {
    const currentShows = extractNodes(this.props.artist.currentShows)
    const upcomingShows = extractNodes(this.props.artist.upcomingShows)
    const currentAndUpcomingShows = [...currentShows, ...upcomingShows]

    const pastLargeShows = extractNodes(this.props.artist.pastLargeShows)
    const pastSmallShows = extractNodes(this.props.artist.pastSmallShows)
    const pastShows = pastLargeShows.length ? pastLargeShows : pastSmallShows
    return (
      <StickyTabPageScrollView>
        <Stack spacing={3} py={2}>
          {!!currentAndUpcomingShows.length && (
            <View>
              <SectionTitle title="Current & Upcoming Shows" />
              <VariableSizeShowsList showSize="large" shows={currentAndUpcomingShows} />
            </View>
          )}
          {!!pastShows.length && (
            <View>
              <SectionTitle title="Past Shows" />
              {this.pastShowsList()}
            </View>
          )}
        </Stack>
      </StickyTabPageScrollView>
    )
  }

  pastShowsList() {
    // TODO: Use `this.props.relay.getVariables().isPad` when this gets merged: https://github.com/facebook/relay/pull/1868
    if (this.props.artist.pastLargeShows) {
      return <VariableSizeShowsList showSize={"medium"} shows={extractNodes(this.props.artist.pastLargeShows)} />
    } else {
      return (
        <SmallList shows={extractNodes(this.props.artist.pastSmallShows)} style={{ marginTop: -8, marginBottom: 50 }} />
      )
    }
  }
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
