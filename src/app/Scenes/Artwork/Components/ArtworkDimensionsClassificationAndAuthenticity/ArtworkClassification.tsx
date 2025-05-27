import { ArtworkIcon, Flex, LinkText, Text } from "@artsy/palette-mobile"
import { ArtworkClassification_artwork$data } from "__generated__/ArtworkClassification_artwork.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
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
        <ArtworkIcon mr={0.5} fill="mono60" height={25} width={25} />

        <Text variant="sm" color="mono60">
          {shortArrayDescription[0]}{" "}
        </Text>

        <RouterLink to="/artwork-classifications" hasChildTouchable>
          <LinkText variant="sm" color="mono60">
            {shortArrayDescription[1]}
          </LinkText>
        </RouterLink>
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
