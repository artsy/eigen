import React from "react"
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import Separator from "../../Separator"
import SerifText from "../../Text/Serif"
import SmallList from "./SmallList"
import VariableSizeShowsList from "./VariableSizeShowsList"

import { Shows_artist } from "__generated__/Shows_artist.graphql"

interface Props {
  artist: Shows_artist
}

class Shows extends React.Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        {this.currentAndUpcomingList()}
        {this.pastShows()}
      </View>
    )
  }

  pastShows() {
    const pastShows = this.props.artist.past_large_shows || this.props.artist.past_small_shows
    if (pastShows.length) {
      return (
        <View>
          <Separator style={{ marginBottom: 20 }} />
          <SerifText style={styles.title}>Past Shows</SerifText>
          {this.pastShowsList()}
        </View>
      )
    } else {
      return null
    }
  }

  pastShowsList() {
    // TODO: Use `this.props.relay.getVariables().isPad` when this gets merged: https://github.com/facebook/relay/pull/1868
    if (this.props.artist.past_large_shows) {
      return <VariableSizeShowsList showSize={"medium"} shows={this.props.artist.past_large_shows as any} />
    } else {
      return <SmallList shows={this.props.artist.past_small_shows} style={{ marginTop: -8, marginBottom: 50 }} />
    }
  }

  currentAndUpcomingList() {
    if (this.props.artist.current_shows.length || this.props.artist.upcoming_shows.length) {
      const shows = [].concat.apply([], [this.props.artist.current_shows, this.props.artist.upcoming_shows])
      return (
        <View style={{ marginBottom: 20 }}>
          <SerifText style={styles.title}>Current & Upcoming Shows</SerifText>
          <VariableSizeShowsList showSize={"large"} shows={shows} />
        </View>
      )
    }
  }
}

interface Styles {
  container: ViewStyle
  title: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    textAlign: "left",
    marginLeft: 0,
  },
})

export default createFragmentContainer(Shows, {
  artist: graphql`
    fragment Shows_artist on Artist {
      current_shows: shows(status: "running") {
        ...VariableSizeShowsList_shows
      }
      upcoming_shows: shows(status: "upcoming") {
        ...VariableSizeShowsList_shows
      }
      past_small_shows: shows(status: "closed", size: 20) @skip(if: $isPad) {
        ...SmallList_shows
      }
      past_large_shows: shows(status: "closed", size: 20) @include(if: $isPad) {
        ...VariableSizeShowsList_shows
      }
    }
  `,
})
