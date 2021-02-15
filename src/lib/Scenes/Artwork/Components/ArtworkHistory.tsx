import { ArtworkHistory_artwork } from "__generated__/ArtworkHistory_artwork.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import { truncatedTextLimit } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { Box, Join, Sans, Spacer } from "palette"
import React from "react"
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

    const displaySections = sections.filter((i) => i.value != null)
    const textLimit = truncatedTextLimit()

    return (
      <Join separator={<Spacer pb="3" />}>
        {displaySections.map(({ title, value, contextModule }, index) => (
          <Box key={index}>
            <Sans size="4t" pb="2">
              {title}
            </Sans>
            <ReadMore
              // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
              content={value}
              contextModule={contextModule}
              maxChars={textLimit}
              textStyle="sans"
              trackingFlow={Schema.Flow.ArtworkDetails}
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
