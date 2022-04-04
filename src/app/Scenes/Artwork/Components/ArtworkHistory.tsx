import { defineMessages } from "@formatjs/intl"
import { ArtworkHistory_artwork } from "__generated__/ArtworkHistory_artwork.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { truncatedTextLimit } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { Box, Join, Sans, Spacer } from "palette"
import React from "react"
import { useIntl } from "react-intl"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkHistoryProps {
  artwork: ArtworkHistory_artwork
}

export const ArtworkHistory: React.FC<ArtworkHistoryProps> = ({ artwork }) => {
  const { provenance, exhibitionHistory, literature } = artwork
  const intl = useIntl()

  const titleMessages = defineMessages({
    provenance: {
      id: "scene.artwork.components.artworkHistory.sections.provenance",
      defaultMessage: "Provenance",
    },
    exhibitionHistory: {
      id: "scene.artwork.components.artworkHistory.sections.exhibitionHistory",
      defaultMessage: "Exhibition History",
    },
    literature: {
      id: "scene.artwork.components.artworkHistory.sections.literature",
      defaultMessage: "Bibliography",
    },
  })

  const sections = [
    {
      title: intl.formatMessage(titleMessages.provenance),
      value: provenance,
      contextModule: Schema.ContextModules.Provenance,
    },
    {
      title: intl.formatMessage(titleMessages.exhibitionHistory),
      value: exhibitionHistory,
      contextModule: Schema.ContextModules.ExhibitionHistory,
    },
    {
      title: intl.formatMessage(titleMessages.literature),
      value: literature,
      contextModule: Schema.ContextModules.Bibliography,
    },
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
