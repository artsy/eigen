import { Separator } from "@artsy/palette-mobile"
import { ArtworkEditionSetInformation_artwork$data } from "__generated__/ArtworkEditionSetInformation_artwork.graphql"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { createFragmentContainer } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkEditionSetsFragmentContainer as ArtworkEditionSets } from "./ArtworkEditionSets"

interface ArtworkEditionSetInformationProps {
  artwork: ArtworkEditionSetInformation_artwork$data
}

const ArtworkEditionSetInformation: React.FC<ArtworkEditionSetInformationProps> = ({ artwork }) => {
  const setSelectedEditionId = ArtworkStore.useStoreActions((action) => action.setSelectedEditionId)

  const handleSelectEdition = (editionId: string) => {
    setSelectedEditionId(editionId)
  }

  return (
    <>
      <Separator />
      <ArtworkEditionSets artwork={artwork} onSelectEdition={handleSelectEdition} />
      <Separator />
    </>
  )
}

export const ArtworkEditionSetInformationFragmentContainer = createFragmentContainer(
  ArtworkEditionSetInformation,
  {
    artwork: graphql`
      fragment ArtworkEditionSetInformation_artwork on Artwork {
        ...ArtworkEditionSets_artwork
      }
    `,
  }
)
