import { Questions_artwork$key } from "__generated__/Questions_artwork.graphql"
import { EnvelopeIcon, Flex, Text } from "palette"
import { graphql, useFragment } from "react-relay"
import { InquiryButtonsFragmentContainer } from "./CommercialButtons/InquiryButtons"

interface QuestionsProps {
  artwork: Questions_artwork$key
}

export const Questions: React.FC<QuestionsProps> = (props) => {
  const artworkData = useFragment(artworkFragment, props.artwork)

  return (
    <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Flex>
        <Text variant="xs">Questions about this piece?</Text>
      </Flex>

      <InquiryButtonsFragmentContainer
        artwork={artworkData}
        variant="outline"
        size="small"
        icon={<EnvelopeIcon fill="black100" width="16px" height="16px" />}
      />
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment Questions_artwork on Artwork {
    ...InquiryButtons_artwork
  }
`
