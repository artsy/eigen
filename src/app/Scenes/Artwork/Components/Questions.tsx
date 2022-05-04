import { Questions_artwork } from "__generated__/Questions_artwork.graphql"
import { Box, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { InquiryButtonsFragmentContainer } from "./CommercialButtons/InquiryButtons"

export interface QuestionsProps {
  artwork: Questions_artwork
}

export const Questions: React.FC<QuestionsProps> = ({ artwork }) => {
  return (
    <Box>
      <Text>Questions about this piece?</Text>
      <InquiryButtonsFragmentContainer
        artwork={artwork}
        variant="outlineGray"
        size="small"
        mt={1}
      />
    </Box>
  )
}

export const QuestionsFragmentContainer = createFragmentContainer(Questions, {
  artwork: graphql`
    fragment Questions_artwork on Artwork {
      ...InquiryButtons_artwork
    }
  `,
})
