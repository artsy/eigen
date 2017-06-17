import * as React from "react"
import * as Relay from "react-relay"

import { Dimensions, StyleSheet, TextStyle, View, ViewProperties, ViewStyle } from "react-native"

import Separator from "../../Separator"
import SerifText from "../../Text/Serif"
import SmallShowsList from "./SmallList"
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
    if (windowDimensions.width > 700) {
      return <VariableSizeShowsList showSize={"medium"} shows={this.props.artist.past_shows} />
    } else {
      return <SmallShowsList shows={this.props.artist.past_shows} style={{ marginTop: -8, marginBottom: 50 }} />
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

const pastShowsFragment = windowDimensions.width > 700
  ? VariableSizeShowsList.getFragment("shows")
  : SmallShowsList.getFragment("shows")

export default Relay.createContainer(Shows, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        current_shows: partner_shows(status: "running") {
          ${VariableSizeShowsList.getFragment("shows")}
        }
        upcoming_shows: partner_shows(status: "upcoming") {
          ${VariableSizeShowsList.getFragment("shows")}
        }
        past_shows: partner_shows(status: "closed", size: 20) {
          ${pastShowsFragment}
        }
      }
    `,
  },
})

interface RelayProps {
  artist: {
    current_shows: Array<boolean | number | string | null> | null
    upcoming_shows: Array<boolean | number | string | null> | null
    past_shows: Array<boolean | number | string | null> | null
  }
}
