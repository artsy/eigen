import { AboutWork_artwork } from "__generated__/AboutWork_artwork.graphql"
import { ReadMore } from "lib/Components/ReadMore"
import { truncatedTextLimit } from "lib/utils/hardware"
import { Schema } from "lib/utils/track"
import { Flex, Join, Sans, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface AboutWorkProps {
  artwork: AboutWork_artwork
}

export class AboutWork extends React.Component<AboutWorkProps> {
  render() {
    const { additional_information, description, isInAuction } = this.props.artwork
    const hasArtworkInfo = additional_information || description
    const textLimit = truncatedTextLimit()

    return (
      hasArtworkInfo && (
        <Join separator={<Spacer mb="2" />}>
          <Sans size="4t">About the work</Sans>
          {!!additional_information && (
            <ReadMore
              content={additional_information}
              maxChars={textLimit}
              trackingFlow={Schema.Flow.AboutTheWork}
              contextModule={Schema.ContextModules.AboutTheWork}
              textStyle="sans"
            />
          )}
          {!!description && (
            <Flex>
              {!isInAuction && (
                <Sans size="2" color="black60" mb="3">
                  From Artsy Specialist:
                </Sans>
              )}
              <ReadMore
                content={description}
                maxChars={textLimit}
                trackingFlow={Schema.Flow.AboutTheWork}
                contextModule={Schema.ContextModules.AboutTheWorkFromSpecialist}
              />
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
      additional_information: additionalInformation
      description
      isInAuction
    }
  `,
})
