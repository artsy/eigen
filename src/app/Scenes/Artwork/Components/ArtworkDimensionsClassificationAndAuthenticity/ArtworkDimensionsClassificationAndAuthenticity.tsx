import { Box, Spacer, Text } from "@artsy/palette-mobile"
import { ArtworkDimensionsClassificationAndAuthenticity_artwork$data } from "__generated__/ArtworkDimensionsClassificationAndAuthenticity_artwork.graphql"
import { ArtworkAuthenticityCertificateFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkDimensionsClassificationAndAuthenticity/ArtworkAuthenticityCertificate"
import { ArtworkClassificationFragmentContainer } from "app/Scenes/Artwork/Components/ArtworkDimensionsClassificationAndAuthenticity/ArtworkClassification"
import { useArtworkDimensions } from "app/utils/hooks/useArtworkDimensions"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkDimensionsClassificationAndAuthenticityProps {
  artwork: ArtworkDimensionsClassificationAndAuthenticity_artwork$data
}

const ArtworkDimensionsClassificationAndAuthenticity: React.FC<
  ArtworkDimensionsClassificationAndAuthenticityProps
> = ({ artwork }) => {
  const { medium, dimensions, framedDimensions, framed, editionOf, editionSets, isUnlisted } =
    artwork

  const { dimensionText, isFramedSizeEnabled } = useArtworkDimensions({
    dimensions,
    framedDimensions,
    includeFrameText: true,
  })

  return (
    <Box>
      <Spacer y={2} />
      <Text color="mono60" variant="sm">
        {medium}
      </Text>
      {!!dimensionText && (editionSets?.length ?? 0) < 2 && (
        <Text color="mono60" variant="sm">
          {dimensionText}
        </Text>
      )}
      {!isFramedSizeEnabled && !!getFrameString(framed?.details, isUnlisted) && (
        <Text color="mono60" variant="sm">
          {getFrameString(framed?.details, isUnlisted)}
        </Text>
      )}
      {!!editionOf && (
        <Text color="mono60" variant="sm">
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
        framedDimensions {
          in
          cm
        }
        framed {
          details
        }
        editionOf
        isEdition
        isUnlisted
        editionSets {
          internalID
        }
        ...ArtworkClassification_artwork
        ...ArtworkAuthenticityCertificate_artwork
      }
    `,
  })

export const getFrameString = (frameDetails?: string | null, isUnlisted?: boolean) => {
  if (frameDetails !== "Included") {
    if (isUnlisted) {
      return "Frame not included"
    } else {
      return
    }
  }

  return `Frame ${frameDetails.toLowerCase()}`
}
