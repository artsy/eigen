import React from "react"
import { Dimensions, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import removeMarkdown from "remove-markdown"

import { Join, Sans, Spacer } from "@artsy/palette"
import { Biography_artist } from "__generated__/Biography_artist.graphql"
import { SectionTitle } from "../SectionTitle"

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

    const bio = this.props.artist.bio?.replace("born", "b.")

    return (
      <View style={{ marginLeft: sideMargin, marginRight: sideMargin }}>
        <SectionTitle title="Biography" />
        <Join separator={<Spacer mb={2} />}>
          {!!artist.blurb && <Sans size="3">{removeMarkdown(artist.blurb)}</Sans>}
          {!!bio && <Sans size="3">{bio}</Sans>}
        </Join>
      </View>
    )
  }
}

export default createFragmentContainer(Biography, {
  artist: graphql`
    fragment Biography_artist on Artist {
      bio
      blurb
    }
  `,
})
