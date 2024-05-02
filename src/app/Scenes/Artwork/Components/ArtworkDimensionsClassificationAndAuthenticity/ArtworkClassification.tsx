import { Flex, Text, ArtworkIcon, LinkText } from "@artsy/palette-mobile"
import { ArtworkClassification_artwork$data } from "__generated__/ArtworkClassification_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkClassificationProps {
  artwork: ArtworkClassification_artwork$data
}

const ArtworkClassification: React.FC<ArtworkClassificationProps> = ({ artwork }) => {
  if (!artwork.attributionClass?.shortArrayDescription?.length) {
    return null
  }

  const shortArrayDescription = artwork.attributionClass?.shortArrayDescription

  return (
    <>
      <Flex testID="artwork-classification" flexDirection="row" alignContent="center">
        <ArtworkIcon mr={0.5} fill="black60" />
        <Text variant="xs" color="black60">
          {shortArrayDescription[0]}{" "}
          <LinkText
            variant="xs"
            color="black60"
            onPress={() => navigate(`/artwork-classifications`)}
          >
            {shortArrayDescription[1]}
          </LinkText>
        </Text>
      </Flex>
    </>
  )
}

export const ArtworkClassificationFragmentContainer = createFragmentContainer(
  ArtworkClassification,
  {
    artwork: graphql`
      fragment ArtworkClassification_artwork on Artwork {
        attributionClass {
          shortArrayDescription
        }
      }
    `,
  }
)
