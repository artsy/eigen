import { Box, Join, Sans, Spacer } from "@artsy/palette"
import { ArtworkHistory_artwork } from "__generated__/ArtworkHistory_artwork.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import { Schema } from "lib/utils/track"
import React from "react"
import { Platform, PlatformIOSStatic } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkHistoryProps {
  artwork: ArtworkHistory_artwork
}

export class ArtworkHistory extends React.Component<ArtworkHistoryProps> {
  render() {
    const { provenance, exhibition_history, literature } = this.props.artwork
    const sections = [
      { title: "Provenance", value: provenance, contextModule: Schema.ContextModules.Provenance },
      {
        title: "Exhibition History",
        value: exhibition_history,
        contextModule: Schema.ContextModules.ExhibitionHistory,
      },
      { title: "Bibliography", value: literature, contextModule: Schema.ContextModules.Bibliography },
    ]

    const displaySections = sections.filter(i => i.value != null)

    const IOSPlatform = Platform as PlatformIOSStatic
    const textLimit = IOSPlatform.isPad ? 320 : 140

    return (
      <Join separator={<Spacer pb={3} />}>
        {displaySections.map(({ title, value, contextModule }, index) => (
          <Box key={index}>
            <Sans size="3" weight="medium" pb={2}>
              {title}
            </Sans>
            <ReadMore
              content={value}
              maxChars={textLimit}
              trackingFlow={Schema.Flow.ArtworkDetails}
              contextModule={contextModule}
            />
          </Box>
        ))}
      </Join>
    )
  }
}

export const ArtworkHistoryFragmentContainer = createFragmentContainer(ArtworkHistory, {
  artwork: graphql`
    fragment ArtworkHistory_artwork on Artwork {
      provenance
      exhibition_history: exhibitionHistory
      literature
    }
  `,
})
