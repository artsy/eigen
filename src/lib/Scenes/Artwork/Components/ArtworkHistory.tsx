import { Box, Sans } from "@artsy/palette"
import { ArtworkHistory_artwork } from "__generated__/ArtworkHistory_artwork.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkHistoryProps {
  artwork: ArtworkHistory_artwork
}

export class ArtworkHistory extends React.Component<ArtworkHistoryProps> {
  render() {
    const { provenance, exhibition_history, literature } = this.props.artwork
    const sections = [
      { title: "Provenance", value: provenance },
      { title: "Exhibition History", value: exhibition_history },
      { title: "Bibliography", value: literature },
    ]

    const displaySections = sections.filter(i => i.value != null)

    return (
      <>
        {displaySections.map(({ title, value }, index) => (
          <React.Fragment key={index}>
            <Box>
              <Sans size="3" weight="medium">
                {title}
              </Sans>
              <ReadMore content={value} maxChars={140} />
            </Box>
          </React.Fragment>
        ))}
      </>
    )
  }
}

export const ArtworkHistoryFragmentContainer = createFragmentContainer(ArtworkHistory, {
  artwork: graphql`
    fragment ArtworkHistory_artwork on Artwork {
      provenance
      exhibition_history
      literature
    }
  `,
})
