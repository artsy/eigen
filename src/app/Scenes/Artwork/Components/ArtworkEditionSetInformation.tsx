import { Spacer } from "@artsy/palette-mobile"
import { ArtworkEditionSetInformation_artwork$data } from "__generated__/ArtworkEditionSetInformation_artwork.graphql"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Box, Separator, Text } from "palette"
import { createFragmentContainer } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkEditionSetsFragmentContainer as ArtworkEditionSets } from "./ArtworkEditionSets"

interface ArtworkEditionSetInformationProps {
  artwork: ArtworkEditionSetInformation_artwork$data
}

const ArtworkEditionSetInformation: React.FC<ArtworkEditionSetInformationProps> = ({ artwork }) => {
  const enableArtworkRedesign = useFeatureFlag("ARArtworkRedesingPhase2")
  const selectedEditionId = ArtworkStore.useStoreState((state) => state.selectedEditionId)
  const setSelectedEditionId = ArtworkStore.useStoreActions((action) => action.setSelectedEditionId)
  const editionSets = artwork.editionSets ?? []
  const selectedEdition = editionSets.find((editionSet) => {
    return editionSet?.internalID === selectedEditionId
  })

  const handleSelectEdition = (editionId: string) => {
    setSelectedEditionId(editionId)
  }

  if (enableArtworkRedesign) {
    return (
      <>
        <Separator />
        <ArtworkEditionSets artwork={artwork} onSelectEdition={handleSelectEdition} />
        <Separator />
      </>
    )
  }

  return (
    <>
      <Box mt={-3}>
        <ArtworkEditionSets artwork={artwork} onSelectEdition={handleSelectEdition} />
      </Box>
      <Separator />

      {!!selectedEdition?.saleMessage && (
        <>
          <Spacer y={4} />
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
