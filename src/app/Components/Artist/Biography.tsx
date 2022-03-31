import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import removeMarkdown from "remove-markdown"

import { Biography_artist } from "__generated__/Biography_artist.graphql"
import { Sans } from "palette"
import { injectIntl, IntlShape } from "react-intl"
import { SectionTitle } from "../SectionTitle"
import { Stack } from "../Stack"

interface Props {
  artist: Biography_artist
  intl: IntlShape
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
        <SectionTitle
          title={this.props.intl.formatMessage({
            id: "component.artist.biography.section.title",
            defaultMessage: "Biography",
          })}
        />
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

export default createFragmentContainer(injectIntl(Biography), {
  artist: graphql`
    fragment Biography_artist on Artist {
      bio
      blurb
    }
  `,
})
