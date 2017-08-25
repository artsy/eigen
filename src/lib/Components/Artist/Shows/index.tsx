import * as React from "react"
import { createFragmentContainer, graphql } from "react-relay/compat"

import { Dimensions, StyleSheet, TextStyle, View, ViewProperties, ViewStyle } from "react-native"

import Separator from "../../Separator"
import SerifText from "../../Text/Serif"
import SmallList from "./SmallList"
import VariableSizeShowsList from "./VariableSizeShowsList"

const windowDimensions = Dimensions.get("window")

interface Props extends ViewProperties {
  artist: {
    past_shows: any[]
    current_shows: any[]
    upcoming_shows: any[]
  }
}

class Shows extends React.Component<Props, any> {
  render() {
    return (
      <View style={styles.container}>
        {this.currentAndUpcomingList()}
        {this.pastShows()}
      </View>
    )
  }

  pastShows() {
    if (this.props.artist.past_shows.length > 0) {
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
    // if (windowDimensions.width > 700) {
    //   return <VariableSizeShowsList showSize={"medium"} shows={this.props.artist.past_shows} />
    // } else {
    return <SmallList shows={this.props.artist.past_shows} style={{ marginTop: -8, marginBottom: 50 }} />
    // }
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

// TODO How do we dynamically determine what component to use? Needs to be fixed after Relay Modern migration.
// const pastShowsFragment =
//   windowDimensions.width > 700 ? VariableSizeShowsList.getFragment("shows") : SmallShowsList.getFragment("shows")

export default createFragmentContainer(
  Shows,
  graphql`
    fragment Shows_artist on Artist {
      current_shows: partner_shows(status: "running") {
        ...VariableSizeShowsList_shows
      }
      upcoming_shows: partner_shows(status: "upcoming") {
        ...VariableSizeShowsList_shows
      }
      past_shows: partner_shows(status: "closed", size: 20) {
        ...SmallList_shows
      }
    }
  `
)

interface RelayProps {
  artist: {
    current_shows: Array<boolean | number | string | null> | null
    upcoming_shows: Array<boolean | number | string | null> | null
    past_shows: Array<boolean | number | string | null> | null
  }
}
