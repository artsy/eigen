import React from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import removeMarkdown from "remove-markdown"

import SerifText from "../Text/Serif"

import { Sans, Spacer } from "@artsy/palette"
import { Biography_artist } from "__generated__/Biography_artist.graphql"

const sideMargin = Dimensions.get("window").width > 700 ? 50 : 0

interface Props {
  artist: Biography_artist
}

class Biography extends React.Component<Props> {
  render() {
    const artist = this.props.artist
    if (!artist.blurb && !artist.bio) {
      return null
    }

    return (
      <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>
        <Sans size="3t" weight="medium">
          Biography
        </Sans>
        <Spacer mb={2} />
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
    marginBottom: 20,
  },
})

export default createFragmentContainer(Biography, {
  artist: graphql`
    fragment Biography_artist on Artist {
      bio
      blurb
    }
  `,
})
