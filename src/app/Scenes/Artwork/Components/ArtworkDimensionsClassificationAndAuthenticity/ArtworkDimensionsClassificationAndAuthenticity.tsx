import { Box, Spacer, Text } from "@artsy/palette-mobile"
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
      return "Frame not included"
    }

    return `Frame ${frameDetails.toLowerCase()}`
  }

  return (
    <Box>
      <Spacer y={2} />
      <Text color="black60" variant="sm">
        {medium}
      </Text>
      {!!dimensionsPresent(dimensions) && (editionSets?.length ?? 0) < 2 && (
        <Text color="black60" variant="sm">{`${dimensions?.in} | ${dimensions?.cm}`}</Text>
      )}
      {!!getFrameString(framed?.details) && (
        <Text color="black60" variant="sm">
          {getFrameString(framed?.details)}
        </Text>
      )}
      {!!editionOf && (
        <Text color="black60" variant="sm">
          {editionOf}
        </Text>
      )}

      {/* classification */}
      <ArtworkClassificationFragmentContainer artwork={artwork} />

      {/* authenticity */}
      <ArtworkAuthenticityCertificateFragmentContainer artwork={artwork} />
      <Spacer y={2} />
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
