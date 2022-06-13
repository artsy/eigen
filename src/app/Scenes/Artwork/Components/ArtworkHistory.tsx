import { ArtworkHistory_artwork$data } from "__generated__/ArtworkHistory_artwork.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { truncatedTextLimit } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { Box, Join, Sans, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkHistoryProps {
  artwork: ArtworkHistory_artwork$data
}

export const ArtworkHistory: React.FC<ArtworkHistoryProps> = ({ artwork }) => {
  const { provenance, exhibitionHistory, literature } = artwork

  const sections = [
    { title: "Provenance", value: provenance, contextModule: Schema.ContextModules.Provenance },
    {
      title: "Exhibition History",
      value: exhibitionHistory,
      contextModule: Schema.ContextModules.ExhibitionHistory,
    },
    { title: "Bibliography", value: literature, contextModule: Schema.ContextModules.Bibliography },
  ]

  const displaySections = sections.filter((i) => i.value != null)
  const textLimit = truncatedTextLimit()

  return (
    <Join separator={<Spacer pb={3} />}>
      {displaySections.map(({ title, value, contextModule }, index) => (
        <Box key={index}>
          <Sans size="4t" pb={2}>
            {title}
          </Sans>
          <ReadMore
            content={value || ""}
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

export const ArtworkHistoryFragmentContainer = createFragmentContainer(ArtworkHistory, {
  artwork: graphql`
    fragment ArtworkHistory_artwork on Artwork {
      provenance
      exhibitionHistory
      literature
    }
  `,
})
