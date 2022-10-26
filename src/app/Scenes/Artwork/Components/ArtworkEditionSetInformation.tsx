import { ArtworkEditionSetInformation_artwork$data } from "__generated__/ArtworkEditionSetInformation_artwork.graphql"
import { Box, Separator, Spacer, Text } from "palette"
import { createFragmentContainer } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkEditionSetsFragmentContainer as ArtworkEditionSets } from "./ArtworkEditionSets"

interface ArtworkEditionSetInformationProps {
  artwork: ArtworkEditionSetInformation_artwork$data
  selectedEditionId: string | null
  onSelectEdition: (editionId: string) => void
}

const ArtworkEditionSetInformation: React.FC<ArtworkEditionSetInformationProps> = ({
  artwork,
  selectedEditionId,
  onSelectEdition,
}) => {
  const editionSets = artwork.editionSets ?? []
  const selectedEdition = editionSets.find((editionSet) => {
    return editionSet?.internalID === selectedEditionId
  })

  return (
    <>
      <Box mt={-3}>
        <ArtworkEditionSets artwork={artwork} onSelectEdition={onSelectEdition} />
      </Box>
      <Separator />

      {!!selectedEdition?.saleMessage && (
        <>
          <Spacer mb={3} />
          <Text variant="lg-display" accessibilityLabel="Selected edition set">
            {selectedEdition.saleMessage}
          </Text>
        </>
      )}
    </>
  )
}

export const ArtworkEditionSetInformationFragmentContainer = createFragmentContainer(
  ArtworkEditionSetInformation,
  {
    artwork: graphql`
      fragment ArtworkEditionSetInformation_artwork on Artwork {
        ...ArtworkEditionSets_artwork
        editionSets {
          internalID
          saleMessage
        }
      }
    `,
  }
)
