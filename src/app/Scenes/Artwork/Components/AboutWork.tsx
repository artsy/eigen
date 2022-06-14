import { AboutWork_artwork$data } from "__generated__/AboutWork_artwork.graphql"
import { ReadMore } from "app/Components/ReadMore"
import { truncatedTextLimit } from "app/utils/hardware"
import { Schema } from "app/utils/track"
import { Flex, Join, Sans, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface AboutWorkProps {
  artwork: AboutWork_artwork$data
}

export const AboutWork: React.FC<AboutWorkProps> = ({ artwork }) => {
  const { additionalInformation, description, isInAuction } = artwork
  const hasArtworkInfo = additionalInformation || description
  const textLimit = truncatedTextLimit()

  if (!hasArtworkInfo) {
    return null
  }

  return (
    <Join separator={<Spacer mb={2} />}>
      <Sans size="4t">About the work</Sans>
      {!!additionalInformation && (
        <ReadMore
          content={additionalInformation}
          maxChars={textLimit}
          trackingFlow={Schema.Flow.AboutTheWork}
          contextModule={Schema.ContextModules.AboutTheWork}
          textStyle="sans"
        />
      )}
      {!!description && (
        <Flex>
          {!isInAuction && (
            <Sans size="2" color="black60" mb="3px">
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
}

export const AboutWorkFragmentContainer = createFragmentContainer(AboutWork, {
  artwork: graphql`
    fragment AboutWork_artwork on Artwork {
      additionalInformation
      description
      isInAuction
    }
  `,
})
