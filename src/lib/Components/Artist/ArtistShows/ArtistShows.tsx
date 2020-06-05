import { ArtistShows_artist } from "__generated__/ArtistShows_artist.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { Stack } from "lib/Components/Stack"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
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
    const currentShows = this.props.artist.currentShows?.edges?.map(edge => edge?.node!) ?? []
    const upcomingShows = this.props.artist.upcomingShows?.edges?.map(edge => edge?.node!) ?? []
    const currentAndUpcomingShows = [...currentShows, ...upcomingShows]

    const pastLargeShows = this.props.artist.pastLargeShows?.edges?.map(edge => edge?.node!) ?? []
    const pastSmallShows = this.props.artist.pastSmallShows?.edges?.map(edge => edge?.node!) ?? []
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
      return (
        <VariableSizeShowsList
          showSize={"medium"}
          // @ts-ignore STRICTNESS_MIGRATION
          shows={this.props.artist.pastLargeShows.edges.map(({ node }) => node)}
        />
      )
    } else {
      return (
        <SmallList
          // @ts-ignore STRICTNESS_MIGRATION
          shows={this.props.artist.pastSmallShows.edges.map(({ node }) => node)}
          style={{ marginTop: -8, marginBottom: 50 }}
        />
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
