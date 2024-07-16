import { EnvelopeIcon, Flex, Text } from "@artsy/palette-mobile"
import { Questions_artwork$key } from "__generated__/Questions_artwork.graphql"
import { graphql, useFragment } from "react-relay"
import { InquiryButtons } from "./CommercialButtons/InquiryButtons"

interface QuestionsProps {
  artwork: Questions_artwork$key
}

export const Questions: React.FC<QuestionsProps> = (props) => {
  const artworkData = useFragment(artworkFragment, props.artwork)

  return (
    <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
      <Flex mr={0.5} flex={1}>
        <Text variant="xs">Questions about this piece?</Text>
      </Flex>

      <Flex flex={1} alignItems="flex-end">
        <InquiryButtons
          artwork={artworkData}
          variant="outline"
          size="small"
          icon={<EnvelopeIcon fill="black100" width="16px" height="16px" />}
        />
      </Flex>
    </Flex>
  )
}

const artworkFragment = graphql`
  fragment Questions_artwork on Artwork {
    ...InquiryButtons_artwork
  }
`
