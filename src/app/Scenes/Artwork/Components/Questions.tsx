import { Questions_artwork$key } from "__generated__/Questions_artwork.graphql"
import { Box, Text } from "palette"
import React from "react"
import { graphql, useFragment } from "react-relay"
import { InquiryButtonsFragmentContainer } from "./CommercialButtons/InquiryButtons"

interface QuestionsProps {
  artwork: Questions_artwork$key
}

export const Questions: React.FC<QuestionsProps> = (props) => {
  const artworkData = useFragment(artworkFragment, props.artwork)

  return (
    <Box>
      <Text>Questions about this piece?</Text>
      <InquiryButtonsFragmentContainer
        artwork={artworkData}
        variant="outlineGray"
        size="small"
        mt={1}
      />
    </Box>
  )
}

const artworkFragment = graphql`
  fragment Questions_artwork on Artwork {
    ...InquiryButtons_artwork
  }
`
