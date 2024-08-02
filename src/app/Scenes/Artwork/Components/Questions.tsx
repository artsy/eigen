import { EnvelopeIcon, Flex, Text } from "@artsy/palette-mobile"
import { InquiryModal_me$key } from "__generated__/InquiryModal_me.graphql"
import { Questions_artwork$key } from "__generated__/Questions_artwork.graphql"
import { graphql, useFragment } from "react-relay"
import { ContactGalleryButton } from "./CommercialButtons/ContactGalleryButton"

interface QuestionsProps {
  artwork: Questions_artwork$key
  me: InquiryModal_me$key
}

export const Questions: React.FC<QuestionsProps> = (props) => {
  const artworkData = useFragment(artworkFragment, props.artwork)

  return (
    <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
      <Flex mr={0.5} flex={1}>
        <Text variant="xs">Questions about this piece?</Text>
      </Flex>

      <Flex flex={1} alignItems="flex-end">
        <ContactGalleryButton
          artwork={artworkData}
          me={props.me}
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
    ...ContactGalleryButton_artwork
  }
`
