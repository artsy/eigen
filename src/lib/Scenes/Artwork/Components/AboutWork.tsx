import { Flex, Join, Sans, Spacer } from "@artsy/palette"
import { AboutWork_artwork } from "__generated__/AboutWork_artwork.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface AboutWorkProps {
  artwork: AboutWork_artwork
}

export class AboutWork extends React.Component<AboutWorkProps> {
  render() {
    const { additional_information, description } = this.props.artwork
    const hasArtworkInfo = additional_information || description

    return (
      hasArtworkInfo && (
        <Join separator={<Spacer mb={2} />}>
          <Sans size="3t" weight="medium">
            About the work
          </Sans>
          {additional_information && <ReadMore content={additional_information} maxChars={140} />}
          {description && (
            <Flex>
              <Sans size="2" color="black60" mb="3px">
                From Artsy Specialist:
              </Sans>
              <ReadMore content={description} maxChars={140} />
            </Flex>
          )}
        </Join>
      )
    )
  }
}

export const AboutWorkFragmentContainer = createFragmentContainer(AboutWork, {
  artwork: graphql`
    fragment AboutWork_artwork on Artwork {
      additional_information
      description
    }
  `,
})
