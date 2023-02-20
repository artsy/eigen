import { Spacer, Box, Text } from "@artsy/palette-mobile"
import { ArtworkHistory_artwork$data } from "__generated__/ArtworkHistory_artwork.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { truncatedTextLimit } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { Join } from "palette"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkHistoryProps {
  artwork: ArtworkHistory_artwork$data
}

export const ArtworkHistory: React.FC<ArtworkHistoryProps> = ({ artwork }) => {
  const { provenance, exhibitionHistory, literature } = artwork

  const sections = [
    { title: "Provenance", value: provenance, contextModule: Schema.ContextModules.Provenance },
    {
      title: "Exhibition history",
      value: exhibitionHistory,
      contextModule: Schema.ContextModules.ExhibitionHistory,
    },
    { title: "Bibliography", value: literature, contextModule: Schema.ContextModules.Bibliography },
  ]

  const displaySections = sections.filter((i) => i.value != null)
  const textLimit = truncatedTextLimit()

  return (
    <Join separator={<Spacer y={4} />}>
      {displaySections.map(({ title, value, contextModule }, index) => (
        <Box key={index}>
          <Text variant="md" pb={1}>
            {title}
          </Text>
          <ReadMore
            content={value || ""}
            contextModule={contextModule}
            maxChars={textLimit}
            textStyle="new"
            textVariant="sm"
            linkTextVariant="sm-display"
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
