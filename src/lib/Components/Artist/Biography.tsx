import * as React from "react"
import { Dimensions, StyleSheet, View, ViewProperties } from "react-native"
import * as Relay from "react-relay/classic"

import * as removeMarkdown from "remove-markdown"

import Headline from "../Text/Headline"
import SerifText from "../Text/Serif"

const sideMargin = Dimensions.get("window").width > 700 ? 50 : 0

interface Props extends ViewProperties {
  artist: any
}

class Biography extends React.Component<Props, any> {
  render() {
    const artist = this.props.artist
    if (!artist.blurb && !artist.bio) {
      return null
    }

    return (
      <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>
        <Headline style={{ marginBottom: 20 }}>Biography</Headline>
        {this.blurb(artist)}
        <SerifText style={styles.bio} numberOfLines={0}>
          {this.bioText()}
        </SerifText>
      </View>
    )
  }

  blurb(artist) {
    if (artist.blurb) {
      return (
        <SerifText style={styles.blurb} numberOfLines={0}>
          {removeMarkdown(artist.blurb)}
        </SerifText>
      )
    }
  }

  bioText() {
    const bio = this.props.artist.bio
    return bio.replace("born", "b.")
  }
}

const styles = StyleSheet.create({
  blurb: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 20,
  },
  bio: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 40,
  },
})

export default Relay.createContainer(Biography, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        bio
        blurb
      }
    `,
  },
})

interface RelayProps {
  artist: {
    bio: string | null
    blurb: string | null
  }
}
