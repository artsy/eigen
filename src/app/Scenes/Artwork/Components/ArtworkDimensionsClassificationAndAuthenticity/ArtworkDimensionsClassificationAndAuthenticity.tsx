import { Box, Text } from "@artsy/palette-mobile"
import { ArtworkDimensionsClassificationAndAuthenticity_artwork$data } from "__generated__/ArtworkDimensionsClassificationAndAuthenticity_artwork.graphql"
import { ArtworkAuthenticityCertificateFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkDimensionsClassificationAndAuthenticity/ArtworkAuthenticityCertificate"
import { ArtworkClassificationFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkDimensionsClassificationAndAuthenticity/ArtworkClassification"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkDimensionsClassificationAndAuthenticityProps {
  artwork: ArtworkDimensionsClassificationAndAuthenticity_artwork$data
}

const ArtworkDimensionsClassificationAndAuthenticity: React.FC<
  ArtworkDimensionsClassificationAndAuthenticityProps
> = ({ artwork }) => {
  const { medium, dimensions, framed, editionOf, editionSets } = artwork

  const dimensionsPresent = (dimensions: any) =>
    /\d/.test(dimensions?.in) || /\d/.test(dimensions?.cm)

  const getFrameString = (frameDetails?: string | null) => {
    if (frameDetails !== "Included") {
      return
    }

    return `Frame ${frameDetails.toLowerCase()}`
  }

  return (
    <Box>
      <Text color="black60" variant="xs">
        {medium}
      </Text>
      {!!dimensionsPresent(dimensions) && (editionSets?.length ?? 0) < 2 && (
        <Text color="black60" variant="xs">{`${dimensions?.in} | ${dimensions?.cm}`}</Text>
      )}
      {!!getFrameString(framed?.details) && (
        <Text color="black60" variant="xs">
          {getFrameString(framed?.details)}
        </Text>
      )}
      {!!editionOf && (
        <Text color="black60" variant="xs">
          {editionOf}
        </Text>
      )}

      {/* classification */}
      <ArtworkClassificationFragmentContainer artwork={artwork} />

      {/* authenticity */}
      <ArtworkAuthenticityCertificateFragmentContainer artwork={artwork} />
    </Box>
  )
}

export const ArtworkDimensionsClassificationAndAuthenticityFragmentContainer =
  createFragmentContainer(ArtworkDimensionsClassificationAndAuthenticity, {
    artwork: graphql`
      fragment ArtworkDimensionsClassificationAndAuthenticity_artwork on Artwork {
        medium
        dimensions {
          in
          cm
        }
        framed {
          details
        }
        editionOf
        isEdition
        editionSets {
          internalID
        }
        ...ArtworkClassification_artwork
        ...ArtworkAuthenticityCertificate_artwork
      }
    `,
  })
