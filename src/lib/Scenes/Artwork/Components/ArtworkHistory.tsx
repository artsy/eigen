// provenance, exhibition history, and bibliography

import { Box, Sans } from "@artsy/palette"
import { ArtworkHistory_artwork } from "__generated__/ArtworkHistory_artwork.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkHistoryProps {
  artwork: ArtworkHistory_artwork
}

interface ArtworkHistoryState {
  expand: boolean
}

export class ArtworkHistory extends React.Component<ArtworkHistoryProps, ArtworkHistoryState> {
  state = { expand: false }

  render() {
    const sections = [
      { title: "Provenance", value: this.props.artwork.provenance },
      { title: "Exhibition History", value: this.props.artwork.exhibition_history },
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
    }
  `,
})
