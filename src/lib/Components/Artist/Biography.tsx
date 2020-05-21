import React from "react"
import { Dimensions, StyleSheet, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

// @ts-ignore STRICTNESS_MIGRATION
import removeMarkdown from "remove-markdown"

import { Serif } from "../Text/Serif"

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
        <Serif style={styles.bio} numberOfLines={0}>
          {this.bioText()}
        </Serif>
      </View>
    )
  }

  // @ts-ignore STRICTNESS_MIGRATION
  blurb(artist) {
    if (artist.blurb) {
      return (
        <Serif style={styles.blurb} numberOfLines={0}>
          {removeMarkdown(artist.blurb)}
        </Serif>
      )
    }
  }

  bioText() {
    const bio = this.props.artist.bio
    // @ts-ignore STRICTNESS_MIGRATION
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

export const BiographyContainer = createFragmentContainer(Biography, {
  artist: graphql`
    fragment Biography_artist on Artist {
      bio
      blurb
    }
  `,
})
