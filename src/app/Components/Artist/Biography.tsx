import { Text } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import removeMarkdown from "remove-markdown"

import { Biography_artist$data } from "__generated__/Biography_artist.graphql"
import { SectionTitle } from "../SectionTitle"
import { Stack } from "../Stack"

interface Props {
  artist: Biography_artist$data
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
            <Text variant="sm" style={{ maxWidth: 650 }}>
              {removeMarkdown(artist.blurb)}
            </Text>
          )}
          {!!bio && <Text variant="sm">{bio}</Text>}
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
