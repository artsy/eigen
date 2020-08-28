import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import removeMarkdown from "remove-markdown"

import { Biography_artist } from "__generated__/Biography_artist.graphql"
import { Sans } from "palette"
import { SectionTitle } from "../SectionTitle"
import { Stack } from "../Stack"

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
      <View>
        <SectionTitle title="Biography" />
        <Stack>
          {!!artist.blurb && (
            <Sans size="3" style={{ maxWidth: 650 }}>
              {removeMarkdown(artist.blurb)}
            </Sans>
          )}
          {!!bio && <Sans size="3">{bio}</Sans>}
        </Stack>
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
